"use client";
import { useState } from "react";
import { Share2, CheckCircle, KeyRound, Leaf } from "lucide-react";
import { useStore } from "@/store/useStore";
import { generatePickupCode } from "@/lib/ai";
import { FoodItem } from "@/lib/types";
import FoodIcon from "./FoodIcon";
import { toast } from "sonner";

export default function ShareDialog({ item }: { item: FoodItem }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [shared, setShared] = useState(false);
  const shareItem = useStore((s) => s.shareItem);
  const addNotification = useStore((s) => s.addNotification);

  function handleShare() {
    const pickupCode = generatePickupCode();
    setCode(pickupCode);
    shareItem(item.id, pickupCode);
    setShared(true);
    addNotification({
      id: `n-${Date.now()}`, type: "success", title: "Item Shared!",
      message: `${item.name} is now on the community board. Pickup code: ${pickupCode}`,
      time: "just now", isRead: false,
    });
    toast.success(`${item.name} shared! +30 points`);
  }

  if (item.isShared) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[10px] font-medium text-brand-600 flex items-center gap-0.5 hover:text-brand-700 transition-colors"
      >
        <Share2 size={10} /> Share
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => !shared && setOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-card rounded-t-3xl p-6 shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {!shared ? (
              <>
                <div className="w-10 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-5" />
                <div className="flex justify-center mb-4">
                  <FoodIcon category={item.category} size="lg" />
                </div>
                <h3 className="font-display text-xl font-medium text-primary text-center mb-1">Share Anonymously</h3>
                <p className="text-sm text-muted text-center mb-5">
                  Share <strong className="text-secondary">{item.name}</strong> with your building neighbors. Your identity stays private.
                </p>
                <div className="bg-subtle rounded-2xl p-4 mb-5 space-y-2">
                  <InfoRow label="Item" value={`${item.name} (${item.quantity} ${item.unit})`} />
                  <InfoRow label="Expires" value={`in ${item.daysLeft} day${item.daysLeft !== 1 ? "s" : ""}`} />
                  <InfoRow label="Category" value={item.category} />
                  <InfoRow label="Points Earned" value="+30 pts" accent />
                </div>
                <button onClick={handleShare}
                  className="w-full bg-brand-600 text-white rounded-2xl py-3.5 font-semibold text-sm hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Share2 size={14} /> Share with Community
                </button>
                <button onClick={() => setOpen(false)} className="w-full mt-2 py-3 text-sm text-muted hover:text-secondary transition-colors">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-5" />
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 flex items-center justify-center">
                    <CheckCircle size={32} className="text-brand-600" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-display text-xl font-medium text-primary text-center mb-1">Shared Successfully!</h3>
                <p className="text-sm text-muted text-center mb-5">Your neighbor will show this code to pick up the item.</p>
                <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 rounded-2xl p-5 mb-5 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <KeyRound size={12} className="text-brand-600" />
                    <p className="text-xs text-brand-600 font-semibold uppercase tracking-widest">Pickup Code</p>
                  </div>
                  <p className="font-mono text-3xl font-bold text-brand-700 dark:text-brand-400 tracking-[0.3em]">{code}</p>
                  <p className="text-xs text-muted mt-2">Share this code with the claimant</p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="w-full bg-brand-600 text-white rounded-2xl py-3.5 font-semibold text-sm hover:bg-brand-700 transition-all flex items-center justify-center gap-2">
                  <Leaf size={14} /> Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-xs font-medium ${accent ? "text-brand-600" : "text-secondary"}`}>{value}</span>
    </div>
  );
}
