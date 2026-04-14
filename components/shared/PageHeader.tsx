"use client";
import { useStore } from "@/store/useStore";
import { Moon, Sun } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <div className="flex items-start justify-between px-5 pt-12 pb-4">
      <div>
        <h1 className="font-display text-2xl font-medium text-primary leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 mt-1">
        {action}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-full bg-subtle border border-default flex items-center justify-center text-secondary hover:text-primary transition-colors"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </div>
  );
}
