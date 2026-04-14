"use client";
import { useStore } from "@/store/useStore";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import WhyTooltip from "@/components/shared/WhyTooltip";
import FeedbackWidget from "@/components/shared/FeedbackWidget";
import ShareDialog from "@/components/shared/ShareDialog";
import FoodIcon from "@/components/shared/FoodIcon";
import { formatDate, getStatusDot } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AlertTriangle, Leaf, Share2, TrendingUp, Users, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";
import { FoodItem } from "@/lib/types";

export default function DashboardPage() {
  const { foodItems, notifications, profile, sharedListings } = useStore();
  const urgent = foodItems.filter((f) => f.status === "urgent" || f.status === "expired");
  const soon = foodItems.filter((f) => f.status === "soon");
  const fresh = foodItems.filter((f) => f.status === "fresh");
  const activeShares = sharedListings.filter((l) => !l.isClaimed).length;

  return (
    <div className="px-5">
      <PageHeader title="ShareBite" subtitle={`Good morning, ${profile.alias}`} />

      {urgent.length > 0 && (
        <div className="mb-4 border border-rose-200 dark:border-rose-900 rounded-2xl p-4 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-rose-500" />
            <span className="text-sm font-semibold text-rose-600">{urgent.length} item{urgent.length > 1 ? "s" : ""} need attention</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {urgent.map((item) => (
              <span key={item.id} className="flex items-center gap-1.5 text-xs border-2 border-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-lg">
                <AlertTriangle size={10} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up stagger-2">
        <StatCard icon={<Leaf size={16} className="text-brand-600" />} label="Points Earned" value={profile.points.toLocaleString()} accent />
        <StatCard icon={<TrendingUp size={16} className="text-amber-500" />} label="Waste Saved" value={`${profile.wasteReduced} kg`} />
        <StatCard icon={<Share2 size={16} className="text-brand-600" />} label="Items Shared" value={`${profile.itemsShared}`} />
        <StatCard icon={<Users size={16} className="text-stone-500" />} label="Community" value={`${activeShares} active`} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-medium text-primary">Your Pantry</h2>
          <WhyTooltip text="Track your food items here. AI predicts expiry so you waste less and share smarter." />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">{foodItems.length} items</span>
          <Link href="/add-food" className="text-xs text-brand-600 font-medium">+ Add</Link>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { label: "All", count: foodItems.length, color: "bg-stone-100 border-2 text-stone-600 dark:bg-stone-800 dark:text-stone-300" },
          { label: "Urgent", count: urgent.length, color: "border-rose-100 border-2 text-rose-600 dark:border-rose-900/30 dark:text-rose-400" },
          { label: "Soon", count: soon.length, color: "border-amber-100 border-2 text-amber-600 dark:border-amber-900/30 dark:text-amber-400" },
          { label: "Fresh", count: fresh.length, color: "border-green-100 border-2 text-green-600 dark:border-green-900/30 dark:text-green-400" },
        ].map((f) => (
          <span key={f.label} className={cn("text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap shrink-0", f.color)}>
            {f.label} {f.count}
          </span>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        {foodItems.slice(0, 6).map((item, i) => (
          <FoodCard key={item.id} item={item} delay={i} />
        ))}
        {foodItems.length > 6 && (
          <p className="text-xs text-center text-muted py-2">+ {foodItems.length - 6} more items</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-medium text-primary">Community Activity</h2>
          <Link href="/community" className="text-xs text-brand-600 font-medium">See all →</Link>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/20 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">{activeShares} items available to claim</p>
              <p className="text-xs text-muted">From your building neighbors</p>
            </div>
          </div>
          <Link href="/community">
            <div className="mt-3 bg-brand-600 text-white rounded-xl py-2.5 text-center text-sm font-medium hover:bg-brand-700 transition-colors">
              Browse Community Board
            </div>
          </Link>
        </div>
      </div>

      <FeedbackWidget />
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("card p-4 animate-fade-in-up", accent && "border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/20")}>
      <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-xs text-muted">{label}</span></div>
      <p className="text-xl font-semibold text-primary font-display">{value}</p>
    </div>
  );
}

function FoodCard({ item, delay }: { item: FoodItem; delay: number }) {
  return (
    <div className={cn("card p-4 animate-fade-in-up flex items-center gap-3 hover:shadow-sm transition-shadow", `stagger-${Math.min(delay + 1, 6)}`)}>
      <FoodIcon category={item.category} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-primary truncate">{item.name}</p>
          <div className={cn("w-2 h-2 rounded-full shrink-0", getStatusDot(item.status))} />
        </div>
        <p className="text-xs text-muted">{item.quantity} {item.unit} · Expires {formatDate(item.expiryDate)}</p>
        <p className="text-xs text-secondary mt-1 leading-relaxed line-clamp-1">{item.aiSuggestion}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <StatusBadge status={item.status} />
        {!item.isShared && (item.status === "urgent" || item.status === "soon") && <ShareDialog item={item} />}
        {item.isShared && (
          <span className="text-[10px] font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800 flex items-center gap-0.5">
            <CheckCircle size={8} /> Shared
          </span>
        )}
      </div>
    </div>
  );
}
