export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-[#FAFAFA] p-6">
      <h2 className="mb-4 text-base font-semibold text-text-primary">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-text-primary">{label}</label>}
      {children}
      {error && <p className="mt-0.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function inp() {
  return "w-full h-12 rounded-md border border-border bg-[#F8F8F8] px-4 text-sm text-text-primary outline-none focus:border-brand-green transition";
}
