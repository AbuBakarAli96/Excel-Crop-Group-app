import React, { useMemo, useState } from "react";
import { getBuiltInAccounts } from "../../services/authService";
import { getAllRequests } from "../../services/registrationService";
import type { RegistrationRequest } from "../../types/registration";
import type { Role, User } from "../../types/auth";
import { ROLE_LABEL } from "../../types/auth";
import { IconUsersGroup } from "../../components/icons";

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  location: string;
  source: "Built-in" | "Approved request";
}

const ROLE_BADGE: Record<Role, { bg: string; color: string }> = {
  TERRITORY_MANAGER: { bg: "var(--g3)", color: "var(--g1)" },
  REGIONAL_MANAGER: { bg: "#e6f5ee", color: "var(--g2)" },
  HEAD_OFFICE: { bg: "#fff4e0", color: "var(--o2)" },
  ADMIN: { bg: "#fff0e6", color: "var(--o1)" },
};

const builtInToDisplay = (u: User): DisplayUser => ({
  id: u.id,
  name: u.name,
  email: u.username,
  role: u.role,
  location: u.territory ?? u.region ?? "—",
  source: "Built-in",
});

const approvedToDisplay = (r: RegistrationRequest): DisplayUser => ({
  id: r.id,
  name: r.fullName,
  email: r.email,
  role: r.role,
  location: `${r.location.city}, ${r.location.province}`,
  source: "Approved request",
});

const AdminUsers: React.FC = () => {
  const [approved] = useState<RegistrationRequest[]>(() =>
    getAllRequests().filter((r) => r.status === "APPROVED")
  );
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const users = useMemo<DisplayUser[]>(
    () => [...getBuiltInAccounts().map(builtInToDisplay), ...approved.map(approvedToDisplay)],
    [approved]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesQuery =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, roleFilter, search]);

  const roles: (Role | "ALL")[] = ["ALL", "TERRITORY_MANAGER", "REGIONAL_MANAGER", "HEAD_OFFICE", "ADMIN"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="stitle">Users</h1>
        <p className="text-[12.5px] text-[var(--txt2)] mt-1 ml-[14px]">
          Everyone with an active account today — built-in accounts plus approved registration requests.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-2 flex-1">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors"
              style={
                roleFilter === r
                  ? { background: "var(--o1)", color: "#fff" }
                  : { background: "#fff", color: "var(--txt2)", border: "1px solid var(--border)" }
              }
            >
              {r === "ALL" ? "All roles" : ROLE_LABEL[r]}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="ecg-input sm:max-w-[220px]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="ecg-card flex flex-col items-center justify-center text-center py-14 px-6">
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: "#fff0e6", color: "var(--o1)" }}
          >
            <IconUsersGroup size={20} />
          </div>
          <h2 className="text-[15px] font-bold text-[var(--txt)] mb-1">No users found</h2>
          <p className="text-[13px] text-[var(--txt2)]">Try a different search or role filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((u) => {
            const badge = ROLE_BADGE[u.role];
            return (
              <div key={u.id} className="ecg-card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                    style={{ background: "var(--g2)" }}
                  >
                    {u.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-[var(--txt)] truncate">{u.name}</div>
                    <div className="text-[11.5px] text-[var(--txt2)] truncate">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {ROLE_LABEL[u.role]}
                  </span>
                  <span className="text-[11px] text-[var(--txt3)]">{u.source}</span>
                </div>
                <div className="mt-2 text-[11.5px] text-[var(--txt2)] truncate">{u.location}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
