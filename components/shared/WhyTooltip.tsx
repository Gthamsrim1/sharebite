"use client";
import { useState } from "react";
import { HelpCircle, X } from "lucide-react";

export default function WhyTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-muted hover:text-secondary transition-colors"
      >
        <HelpCircle size={14} />
      </button>
      {open && (
        <div className="absolute bottom-6 right-0 w-56 bg-card border border-default rounded-xl p-3 shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-secondary leading-relaxed">{text}</p>
            <button onClick={() => setOpen(false)} className="text-muted shrink-0">
              <X size={12} />
            </button>
          </div>
          <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-card border-r border-b border-default rotate-45" />
        </div>
      )}
    </div>
  );
}
