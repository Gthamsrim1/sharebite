"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { FoodCategory, FoodItem } from "@/lib/types";
import { predictExpiry, getExpiryStatus, getDaysLeft, getAISuggestion } from "@/lib/ai";
import { formatDate, cn } from "@/lib/utils";
import PageHeader from "@/components/shared/PageHeader";
import WhyTooltip from "@/components/shared/WhyTooltip";
import FoodIcon, { getCategoryIcon } from "@/components/shared/FoodIcon";
import {
  Sparkles, ChevronDown, Calendar, Hash, Leaf,
  Milk, Apple, Beef, Wheat, Coffee, Cookie,
  Snowflake, Archive, UtensilsCrossed, Package
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES: { value: FoodCategory; label: string; icon: React.ElementType }[] = [
  { value: "dairy", label: "Dairy", icon: Milk },
  { value: "produce", label: "Produce", icon: Apple },
  { value: "meat", label: "Meat & Fish", icon: Beef },
  { value: "grains", label: "Grains", icon: Wheat },
  { value: "beverages", label: "Beverages", icon: Coffee },
  { value: "snacks", label: "Snacks", icon: Cookie },
  { value: "frozen", label: "Frozen", icon: Snowflake },
  { value: "condiments", label: "Condiments", icon: Archive },
  { value: "leftovers", label: "Leftovers", icon: UtensilsCrossed },
  { value: "other", label: "Other", icon: Package },
];

const UNITS = ["g", "kg", "ml", "litre", "piece", "pack", "box", "can", "loaf", "dozen", "servings", "eggs"];

type AIPreview = { expiryDate: string; daysLeft: number; suggestion: string };

export default function AddFoodPage() {
  const router = useRouter();
  const addFoodItem = useStore((s) => s.addFoodItem);
  const addNotification = useStore((s) => s.addNotification);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("produce");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("piece");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [aiPreview, setAiPreview] = useState<AIPreview | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [step, setStep] = useState<"form" | "preview">("form");

  function handlePredict() {
    if (!name.trim()) { toast.error("Please enter a food name first"); return; }
    setIsPredicting(true);
    setTimeout(() => {
      const expiryDate = predictExpiry(category, purchaseDate);
      const daysLeft = getDaysLeft(expiryDate);
      const suggestion = getAISuggestion(name, daysLeft, category);
      setAiPreview({ expiryDate, daysLeft, suggestion });
      setIsPredicting(false);
      setStep("preview");
    }, 1200);
  }

  function handleSave() {
    if (!aiPreview) return;
    const id = `food-${Date.now()}`;
    const status = getExpiryStatus(aiPreview.daysLeft);
    const newItem: FoodItem = {
      id, name: name.trim(), category,
      quantity: parseFloat(quantity) || 1, unit, purchaseDate,
      expiryDate: aiPreview.expiryDate, status, daysLeft: aiPreview.daysLeft,
      aiSuggestion: aiPreview.suggestion, isShared: false,
    };
    addFoodItem(newItem);
    if (status === "urgent") {
      addNotification({
        id: `n-${Date.now()}`, type: "urgent", title: "Urgent: Use Soon!",
        message: `${name} expires in ${aiPreview.daysLeft} day(s). Act fast!`,
        time: "just now", isRead: false, foodItemId: id,
      });
    }
    toast.success(`${name} added to your pantry!`);
    router.push("/");
  }

  return (
    <div className="px-5 pb-8">
      <PageHeader title="Add Food Item" subtitle="Let AI predict how long it will last" />

      {step === "form" && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="card p-5 space-y-4">
            <FormField label="Food Name" tooltip="We use the name to refine expiry predictions and pick the best category match.">
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Milk, Baby Spinach..."
                className="w-full bg-subtle border border-default rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
              />
            </FormField>

            <FormField label="Category" tooltip="Category helps our AI pick the right expiry window. Produce spoils fast; grains last months.">
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button key={cat.value} onClick={() => setCategory(cat.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all",
                        category === cat.value
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400 font-medium"
                          : "border-default bg-subtle text-secondary hover:border-stone-300 dark:hover:border-stone-600"
                      )}>
                      <Icon size={14} strokeWidth={1.8} /><span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Quantity">
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0.1" step="0.1"
                    className="w-full bg-subtle border border-default rounded-xl pl-8 pr-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all" />
                </div>
              </FormField>
              <FormField label="Unit">
                <div className="relative">
                  <select value={unit} onChange={(e) => setUnit(e.target.value)}
                    className="w-full appearance-none bg-subtle border border-default rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 pr-8 transition-all">
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </FormField>
            </div>

            <FormField label="Purchase Date">
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full bg-subtle border border-default rounded-xl pl-8 pr-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all" />
              </div>
            </FormField>
          </div>

          <button onClick={handlePredict} disabled={isPredicting || !name.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all",
              isPredicting || !name.trim()
                ? "bg-stone-200 dark:bg-stone-800 text-muted cursor-not-allowed"
                : "bg-brand-600 text-white hover:bg-brand-700 active:scale-95 shadow-lg shadow-brand-600/20"
            )}>
            {isPredicting
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analysing with AI...</>
              : <><Sparkles size={16} />Predict Expiry with AI</>
            }
          </button>

          <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-brand-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 mb-1">How AI Prediction Works</p>
                <p className="text-xs text-brand-600 dark:text-brand-500 leading-relaxed">
                  Our model uses food category, purchase date, and storage patterns to estimate expiry — then suggests whether to eat, share, or freeze.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "preview" && aiPreview && (
        <div className="animate-fade-in-up space-y-4">
          <div className="card p-6 flex flex-col items-center">
            <FoodIcon category={category} size="lg" className="mb-4" />
            <h2 className="font-display text-2xl font-medium text-primary mb-1">{name}</h2>
            <p className="text-sm text-muted">{quantity} {unit} · {CATEGORIES.find(c => c.value === category)?.label}</p>
          </div>

          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-brand-600" />
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">AI Prediction Results</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-subtle rounded-xl p-3 text-center">
                <p className="text-xs text-muted mb-1">Predicted Expiry</p>
                <p className="text-sm font-semibold text-primary">{formatDate(aiPreview.expiryDate)}</p>
              </div>
              <div className={cn("rounded-xl p-3 text-center",
                aiPreview.daysLeft <= 2 ? "bg-rose-50 dark:bg-rose-950/20" :
                aiPreview.daysLeft <= 5 ? "bg-amber-50 dark:bg-amber-950/20" : "bg-green-50 dark:bg-green-950/20"
              )}>
                <p className="text-xs text-muted mb-1">Days Remaining</p>
                <p className={cn("text-sm font-semibold",
                  aiPreview.daysLeft <= 2 ? "text-rose-600" :
                  aiPreview.daysLeft <= 5 ? "text-amber-600" : "text-green-600"
                )}>{aiPreview.daysLeft} days</p>
              </div>
            </div>
            <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-brand-600" />
                <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">AI Suggestion</p>
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-500 leading-relaxed">{aiPreview.suggestion}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("form")}
              className="flex-1 py-3.5 rounded-2xl border border-default text-sm font-medium text-secondary hover:bg-subtle transition-all">
              Back
            </button>
            <button onClick={handleSave}
              className="flex-1 py-3.5 rounded-2xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
              <Leaf size={14} />Save to Pantry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children, tooltip }: { label: string; children: React.ReactNode; tooltip?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-xs font-semibold text-secondary uppercase tracking-wide">{label}</label>
        {tooltip && <WhyTooltip text={tooltip} />}
      </div>
      {children}
    </div>
  );
}
