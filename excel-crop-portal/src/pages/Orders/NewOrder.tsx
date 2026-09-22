import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CustomerSelect from "../../components/CustomerSelect";
import ProductSelect from "../../components/ProductSelect";
import type { Customer } from "../../types/customer";
import type { Product } from "../../types/product";
import type { OrderLineItem, PaymentTerm } from "../../types/order";
import { PAYMENT_TERM_LABEL } from "../../types/order";
import { ROLE_LABEL } from "../../types/auth";
import { getAllCustomers, getCustomersForTerritory } from "../../services/customerService";
import { getProducts } from "../../services/priceService";
import { submitOrder, lineNetPrice, lineAmount, draftTotal } from "../../services/orderService";
import { IconPlus, IconTrash, IconCheck } from "../../components/icons";

const currency = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

const PAYMENT_TERMS: PaymentTerm[] = ["ADVANCE_CASH", "CASH_ON_DELIVERY", "REVOLVING_CREDIT"];

let rowIdCounter = 0;
const newRowId = () => `row-${Date.now()}-${rowIdCounter++}`;

const emptyLine = (): OrderLineItem => ({
  rowId: newRowId(),
  productId: "",
  productName: "",
  packSize: "",
  packs: 0,
  unitPrice: 0,
  discountPercent: 0,
});

/** Small read-only label/value pair — used for the auto-populated customer info. */
const InfoField: React.FC<{ label: string; value: string; className?: string }> = ({
  label,
  value,
  className,
}) => (
  <div className={className}>
    <div className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)] mb-0.5">
      {label}
    </div>
    <div className="text-[13px] font-medium text-[var(--txt)] truncate">{value}</div>
  </div>
);

const NewOrder: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const products = useMemo(() => getProducts(), []);

  const customers = useMemo(() => {
    if (!user) return [];
    if (user.role === "TERRITORY_MANAGER" && user.territory) {
      return getCustomersForTerritory(user.territory);
    }
    return getAllCustomers();
  }, [user]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>("REVOLVING_CREDIT");
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState<OrderLineItem[]>([emptyLine()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<{ id: string; total: number } | null>(null);

  const total = useMemo(() => draftTotal(items), [items]);

  const updateItem = (rowId: string, patch: Partial<OrderLineItem>) => {
    setItems((prev) => prev.map((it) => (it.rowId === rowId ? { ...it, ...patch } : it)));
  };

  const handleProductPick = (rowId: string, product: Product) => {
    updateItem(rowId, {
      productId: product.id,
      productName: product.name,
      packSize: product.packSize,
      unitPrice: product.unitPrice,
    });
  };

  const addLine = () => setItems((prev) => [...prev, emptyLine()]);

  const removeLine = (rowId: string) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((it) => it.rowId !== rowId)));
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setPaymentTerm("REVOLVING_CREDIT");
    setRemarks("");
    setItems([emptyLine()]);
    setSubmittedOrder(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validItems = items.filter((it) => it.productId && it.packs > 0);

    if (!selectedCustomer) {
      setError("Please select a customer.");
      return;
    }
    if (validItems.length === 0) {
      setError("Add at least one product with a quantity greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitOrder({
        customerId: selectedCustomer.id,
        paymentTerm,
        remarks,
        items: validItems,
      });
      setSubmittedOrder(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  // New Order is a Territory Manager workflow — other roles get a friendly
  // notice here rather than a broken/empty form. This is a page-level check
  // only; it doesn't touch the shared route/role setup in AppRoutes.
  if (user.role !== "TERRITORY_MANAGER") {
    return (
      <div>
        <h1 className="stitle mb-6">Create New Order</h1>
        <div className="ecg-card ecg-reveal flex flex-col items-center justify-center text-center py-16 px-6">
          <p className="text-[13.5px] text-[var(--txt2)] max-w-sm">
            Creating orders is part of the Territory Manager workflow. {ROLE_LABEL[user.role]}{" "}
            accounts review orders from the order queue instead.
          </p>
        </div>
      </div>
    );
  }

  if (submittedOrder) {
    return (
      <div>
        <h1 className="stitle mb-6">Create New Order</h1>
        <div className="ecg-card ecg-reveal flex flex-col items-center justify-center text-center py-16 px-6">
          <div
            className="ecg-pop-in h-16 w-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "var(--g3)", color: "var(--g1)" }}
          >
            <IconCheck size={28} />
          </div>
          <h2 className="text-[18px] font-bold text-[var(--txt)] mb-1.5">Order submitted</h2>
          <p className="text-[13.5px] text-[var(--txt2)] mb-1">
            Order <span className="font-bold text-[var(--txt)]">{submittedOrder.id}</span> for{" "}
            <span className="font-bold text-[var(--txt)]">{selectedCustomer?.name}</span> has been
            submitted for review.
          </p>
          <p className="text-[20px] font-extrabold mb-6" style={{ color: "var(--g1)" }}>
            {currency(submittedOrder.total)}
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button onClick={resetForm} className="ecg-btn ecg-btn-secondary">
              Create Another Order
            </button>
            <button onClick={() => navigate("/dashboard")} className="ecg-btn ecg-btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="stitle">Create New Order</h1>
        <p className="text-[12.5px] text-[var(--txt2)] mt-1 ml-[14px]">
          {user.territory} · {user.region}
        </p>
      </div>

      {error && (
        <div
          className="mb-5 flex items-start gap-2 px-4 py-3 text-sm rounded-[6px]"
          style={{ background: "#fdecea", color: "var(--r1)", borderLeft: "3px solid var(--r1)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer */}
        <div className="ecg-card p-5 mb-5">
          <h2 className="text-[11.5px] font-bold uppercase tracking-wide text-[var(--txt3)] mb-3">
            Customer
          </h2>
          <CustomerSelect
            id="customer"
            options={customers}
            value={selectedCustomer}
            onChange={setSelectedCustomer}
          />

          {selectedCustomer && (
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <InfoField label="WhatsApp" value={selectedCustomer.whatsapp} />
              <InfoField
                label="Address"
                value={selectedCustomer.address}
                className="col-span-2 sm:col-span-1"
              />
              <InfoField label="Territory" value={selectedCustomer.territory} />
              <InfoField label="Region" value={selectedCustomer.region} />
              {selectedCustomer.approvedLimit !== undefined && (
                <InfoField label="Approved Limit" value={currency(selectedCustomer.approvedLimit)} />
              )}
              {selectedCustomer.currentBalance !== undefined && (
                <InfoField label="Current Balance" value={currency(selectedCustomer.currentBalance)} />
              )}
            </div>
          )}
        </div>

        {/* Payment terms */}
        <div className="ecg-card p-5 mb-5">
          <h2 className="text-[11.5px] font-bold uppercase tracking-wide text-[var(--txt3)] mb-3">
            Payment Terms
          </h2>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_TERMS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setPaymentTerm(t)}
                className={`ecg-pill ${paymentTerm === t ? "ecg-pill-active" : ""}`}
              >
                {PAYMENT_TERM_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="stitle !text-[16px]">Products</h2>
        </div>

        {items.map((item, idx) => (
          <div key={item.rowId} className="ecg-card p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">
                Product {idx + 1}
              </span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLine(item.rowId)}
                  aria-label="Remove this product"
                  className="text-[var(--r1)] hover:opacity-70 transition-opacity"
                >
                  <IconTrash size={16} />
                </button>
              )}
            </div>

            <ProductSelect
              id={`product-${item.rowId}`}
              options={products}
              value={products.find((p) => p.id === item.productId) ?? null}
              onChange={(p) => handleProductPick(item.rowId, p)}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="block mb-1 text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">
                  Packs
                </label>
                <input
                  type="number"
                  min={0}
                  disabled={!item.productId}
                  value={item.packs || ""}
                  onChange={(e) =>
                    updateItem(item.rowId, { packs: Math.max(0, Number(e.target.value) || 0) })
                  }
                  placeholder="0"
                  className="ecg-input disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">
                  Discount %
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  disabled={!item.productId}
                  value={item.discountPercent || ""}
                  onChange={(e) =>
                    updateItem(item.rowId, {
                      discountPercent: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                    })
                  }
                  placeholder="0"
                  className="ecg-input disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">
                  Net Price
                </label>
                <div
                  className="ecg-input flex items-center"
                  style={{ background: "var(--bg)", color: "var(--txt2)" }}
                >
                  {item.productId ? currency(lineNetPrice(item)) : "—"}
                </div>
              </div>
              <div>
                <label className="block mb-1 text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]">
                  Amount
                </label>
                <div
                  className="ecg-input flex items-center font-bold"
                  style={{ background: "var(--bg)", color: "var(--g1)" }}
                >
                  {item.productId ? currency(lineAmount(item)) : "—"}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addLine} className="ecg-btn ecg-btn-secondary w-full sm:w-auto mb-5">
          <IconPlus size={16} />
          Add Product
        </button>

        {/* Total */}
        <div className="ecg-card p-5 mb-5 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[var(--txt2)]">Total</span>
          <span className="text-[20px] font-extrabold" style={{ color: "var(--g1)" }}>
            {currency(total)}
          </span>
        </div>

        {/* Remarks */}
        <div className="ecg-card p-5 mb-5">
          <label
            htmlFor="remarks"
            className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]"
          >
            Remarks / Instructions
          </label>
          <textarea
            id="remarks"
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. delivery instructions, special notes…"
            className="ecg-input resize-none"
          />
        </div>

        <button type="submit" disabled={submitting} className="ecg-btn ecg-btn-primary w-full sm:w-auto">
          {submitting ? "Submitting…" : "Submit Order"}
        </button>
      </form>
    </div>
  );
};

export default NewOrder;
