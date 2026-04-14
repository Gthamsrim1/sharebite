"use client";
import { useState } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const reactions = [
  { icon: Heart, label: "Love it", color: "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20" },
  { icon: ThumbsUp, label: "Good", color: "text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20" },
  { icon: Minus, label: "Neutral", color: "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20" },
  { icon: ThumbsDown, label: "Needs work", color: "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800" },
];

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [voted, setVoted] = useState(false);

  function handleReact(label: string) {
    setVoted(true);
    setOpen(false);
    toast.success(`Feedback received: "${label}" — thank you!`, { duration: 2500 });
  }

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {open && (
        <div className="mb-2 card p-3 shadow-xl animate-fade-in-up w-44">
          <p className="text-xs font-semibold text-secondary mb-2">Rate this feature</p>
          <div className="grid grid-cols-2 gap-1.5">
            {reactions.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => handleReact(label)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  color
                )}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span className="text-[9px] text-muted">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-10 h-10 bg-brand-600 text-white rounded-full shadow-lg shadow-brand-600/30 flex items-center justify-center hover:bg-brand-700 transition-colors",
          voted && "bg-brand-700"
        )}
      >
        <MessageSquare size={16} />
      </button>
    </div>
  );
}
