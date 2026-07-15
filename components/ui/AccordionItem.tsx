"use client";

import { useState } from "react";
import { Icon } from "./Icon";

interface AccordionItemProps {
  label: string;
  children: React.ReactNode;
}

export function AccordionItem({ label, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <Icon
          name={open ? "chevron-down" : "chevron-right"}
          size={16}
          className="text-text-secondary shrink-0 transition-transform"
        />
      </button>
      {open && (
        <div className="pb-4 text-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
