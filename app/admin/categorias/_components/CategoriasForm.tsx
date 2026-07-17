"use client";

interface CategoriasFormProps {
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  newName: string;
  setNewName: (v: string) => void;
  addCategory: () => void;
}

export function CategoriasForm({
  showForm, setShowForm, newName, setNewName, addCategory,
}: CategoriasFormProps) {
  if (!showForm) return null;

  return (
    <div className="flex items-end gap-3 rounded-lg border border-border bg-[#FAFAFA] p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-secondary">Nombre</label>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre de la categoría"
          className="w-64 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
          onKeyDown={(e) => { if (e.key === "Enter") addCategory(); }}
        />
      </div>
      <button
        type="button"
        onClick={addCategory}
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
