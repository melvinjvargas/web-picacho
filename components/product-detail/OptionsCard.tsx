interface OptionsCardProps {
  children: React.ReactNode;
}

export function OptionsCard({ children }: OptionsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-[#FAFAFA] p-6 flex flex-col gap-4">
      {children}
    </div>
  );
}
