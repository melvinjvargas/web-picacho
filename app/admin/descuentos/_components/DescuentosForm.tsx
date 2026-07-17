"use client";

interface DescuentosFormProps {
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  newCode: string;
  setNewCode: (v: string) => void;
  discountType: "percentage" | "fixed";
  setDiscountType: (v: "percentage" | "fixed") => void;
  newPercentage: string;
  setNewPercentage: (v: string) => void;
  newFixedAmount: string;
  setNewFixedAmount: (v: string) => void;
  newValidUntil: string;
  setNewValidUntil: (v: string) => void;
  addDiscount: () => void;
}

export function DescuentosForm({
  showForm, setShowForm,
  newCode, setNewCode,
  discountType, setDiscountType,
  newPercentage, setNewPercentage,
  newFixedAmount, setNewFixedAmount,
  newValidUntil, setNewValidUntil,
  addDiscount,
}: DescuentosFormProps) {
  if (!showForm) return null;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-[#FAFAFA] p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-secondary">Código</label>
        <input
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          placeholder="PICACHO10"
          className="w-40 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-secondary">Tipo</label>
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
          className="w-32 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
        >
          <option value="percentage">Porcentaje</option>
          <option value="fixed">Fijo</option>
        </select>
      </div>
      {discountType === "percentage" ? (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">%</label>
          <input
            value={newPercentage}
            onChange={(e) => setNewPercentage(e.target.value)}
            placeholder="10"
            type="number"
            className="w-20 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">Monto (L.)</label>
          <input
            value={newFixedAmount}
            onChange={(e) => setNewFixedAmount(e.target.value)}
            placeholder="50"
            type="number"
            className="w-24 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-secondary">Válido hasta</label>
        <input
          value={newValidUntil}
          onChange={(e) => setNewValidUntil(e.target.value)}
          type="date"
          className="w-36 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
        />
      </div>
      <button
        type="button"
        onClick={addDiscount}
        className="rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Guardar
      </button>
      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="rounded-lg border border-border bg-[#FAFAFA] px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary"
      >
        Cancelar
      </button>
    </div>
  );
}
