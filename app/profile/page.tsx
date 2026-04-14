"use client";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import PageHeader from "@/components/shared/PageHeader";
import { mockLeaderboard, mockWasteAnalytics } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import {
  Trophy, Flame, Leaf, Share2, ShoppingBag, Star,
  TrendingDown, BarChart2, Crown, Sprout, Zap, Medal, Award, CheckCircle2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import WhyTooltip from "@/components/shared/WhyTooltip";

type BadgeTier = { min: number; label: string; icon: React.ElementType; iconColor: string; next: number | null };

const BADGE_TIERS: BadgeTier[] = [
  { min: 0, label: "Starter", icon: Sprout, iconColor: "text-stone-500", next: 200 },
  { min: 200, label: "Eco Warrior", icon: Leaf, iconColor: "text-brand-600", next: 800 },
  { min: 800, label: "Super Sharer", icon: Zap, iconColor: "text-amber-500", next: 1500 },
  { min: 1500, label: "Champion", icon: Trophy, iconColor: "text-amber-500", next: 3000 },
  { min: 3000, label: "Legend", icon: Crown, iconColor: "text-amber-500", next: null },
];

const LEADERBOARD_BADGE_ICONS: Record<string, React.ElementType> = {
  Champion: Trophy,
  "Super Sharer": Zap,
  "Eco Warrior": Leaf,
  Grower: Sprout,
  Starter: Sprout,
  Legend: Crown,
};

export default function ProfilePage() {
  const { profile } = useStore();
  const [activeChart, setActiveChart] = useState<"waste" | "sharing">("waste");

  const currentTier = BADGE_TIERS.slice().reverse().find((b) => profile.points >= b.min) || BADGE_TIERS[0];
  const CurrentIcon = currentTier.icon;
  const progressToNext = currentTier.next
    ? Math.min(100, ((profile.points - currentTier.min) / (currentTier.next - currentTier.min)) * 100)
    : 100;
  const nextTier = BADGE_TIERS[BADGE_TIERS.findIndex((b) => b === currentTier) + 1];

  return (
    <div className="px-5 pb-8">
      <PageHeader title="Your Impact" subtitle="Track your sustainability journey" />

      <div className="card p-5 mb-4 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-600/20">
            <CurrentIcon size={30} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-xl font-medium text-primary">{profile.alias}</p>
              <span className="text-xs bg-subtle border border-default rounded-full px-2 py-0.5 text-muted">{profile.apartmentCode}</span>
            </div>
            <p className="text-xs text-brand-600 font-medium mt-0.5">{currentTier.label}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Flame size={12} className="text-amber-500" />
              <span className="text-xs text-muted">{profile.streak} day streak</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Progress to {nextTier?.label ?? "max rank"}</span>
            <span className="text-xs font-semibold text-brand-600">{profile.points.toLocaleString()} pts</span>
          </div>
          <div className="h-2 bg-subtle rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-1000" style={{ width: `${progressToNext}%` }} />
          </div>
          {currentTier.next && (
            <p className="text-[10px] text-muted">{currentTier.next - profile.points} more points to {nextTier?.label}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 animate-fade-in-up stagger-2">
        <StatCard icon={<TrendingDown size={16} className="text-brand-600" />} label="Waste Reduced" value={`${profile.wasteReduced} kg`} sub="Since joining" accent />
        <StatCard icon={<Flame size={16} className="text-amber-500" />} label="Day Streak" value={`${profile.streak} days`} sub="Keep it up!" />
        <StatCard icon={<Share2 size={16} className="text-brand-600" />} label="Items Shared" value={`${profile.itemsShared}`} sub="+30 pts each" />
        <StatCard icon={<ShoppingBag size={16} className="text-stone-500" />} label="Items Claimed" value={`${profile.itemsClaimed}`} sub="+20 pts each" />
      </div>

      <div className="card p-5 mb-5 animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-primary">Waste vs Saved</h3>
            <WhyTooltip text="This chart shows how your food waste has decreased over time as you use ShareBite." />
          </div>
          <div className="flex gap-1">
            {(["waste", "sharing"] as const).map((t) => (
              <button key={t} onClick={() => setActiveChart(t)}
                className={cn("px-2.5 py-1 rounded-lg text-[10px] font-medium capitalize transition-all",
                  activeChart === t ? "bg-brand-600 text-white" : "bg-subtle text-muted hover:text-secondary"
                )}>
                {t === "waste" ? "Waste" : "Sharing"}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={mockWasteAnalytics} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradRose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "11px", color: "var(--text-primary)" }} cursor={{ stroke: "var(--border)" }} />
            {activeChart === "waste" ? (
              <>
                <Area type="monotone" dataKey="wasted" stroke="#f43f5e" strokeWidth={2} fill="url(#gradRose)" name="Wasted" />
                <Area type="monotone" dataKey="saved" stroke="#16a34a" strokeWidth={2} fill="url(#gradGreen)" name="Saved" />
              </>
            ) : (
              <Area type="monotone" dataKey="shared" stroke="#16a34a" strokeWidth={2} fill="url(#gradGreen)" name="Shared" />
            )}
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex gap-4 mt-2">
          {activeChart === "waste" ? (
            <>
              <LegendDot color="bg-rose-400" label="Wasted (items)" />
              <LegendDot color="bg-brand-500" label="Saved (items)" />
            </>
          ) : (
            <LegendDot color="bg-brand-500" label="Shared with community" />
          )}
        </div>
      </div>

      <div className="card p-5 animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-primary">Building Leaderboard</h3>
          </div>
          <WhyTooltip text="Friendly competition motivates people to share more. Your alias is anonymous — only you know it's you." />
        </div>
        <div className="space-y-2">
          {mockLeaderboard.map((entry) => {
            const BadgeIcon = LEADERBOARD_BADGE_ICONS[entry.badge] ?? Medal;
            return (
              <div key={entry.rank}
                className={cn("flex items-center gap-3 p-3 rounded-xl transition-all",
                  entry.isCurrentUser ? "bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800" : "bg-subtle"
                )}>
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                  entry.rank === 1 ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600" :
                  entry.rank === 2 ? "bg-stone-100 dark:bg-stone-800 text-stone-500" :
                  entry.rank === 3 ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600" :
                  "bg-stone-100 dark:bg-stone-800 text-muted"
                )}>
                  {entry.rank === 1 ? <Crown size={12} /> : `#${entry.rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={cn("text-sm font-medium truncate", entry.isCurrentUser ? "text-brand-700 dark:text-brand-400" : "text-primary")}>
                      {entry.alias}
                    </p>
                    {entry.isCurrentUser && <span className="text-[10px] text-brand-600 font-semibold">(you)</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <BadgeIcon size={10} className="text-muted" />
                    <p className="text-[10px] text-muted">{entry.badge} · {entry.itemsShared} shared</p>
                  </div>
                </div>
                <span className={cn("text-sm font-bold", entry.isCurrentUser ? "text-brand-600" : "text-secondary")}>
                  {entry.points.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <BadgeTimeline currentPoints={profile.points} />
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={cn("card p-4", accent && "border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/10")}>
      <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-xs text-muted">{label}</span></div>
      <p className="text-xl font-semibold text-primary font-display">{value}</p>
      <p className="text-[10px] text-muted mt-0.5">{sub}</p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[10px] text-muted">{label}</span>
    </div>
  );
}

function BadgeTimeline({ currentPoints }: { currentPoints: number }) {
  return (
    <div className="card p-5 mt-4 animate-fade-in-up stagger-5">
      <div className="flex items-center gap-2 mb-4">
        <Star size={14} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-primary">Badge Journey</h3>
      </div>
      <div className="relative">
        <div className="absolute left-3.5 top-4 bottom-4 w-0.5 bg-border" />
        <div className="space-y-4">
          {BADGE_TIERS.map((tier) => {
            const Icon = tier.icon;
            const earned = currentPoints >= tier.min;
            return (
              <div key={tier.min} className="flex items-center gap-4 relative">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center z-10 border-2 shrink-0",
                  earned ? "bg-brand-600 border-brand-600 shadow-sm shadow-brand-600/30" : "bg-card border-default"
                )}>
                  {earned
                    ? <CheckCircle2 size={13} className="text-white" />
                    : <Icon size={12} className="text-muted" strokeWidth={1.5} />
                  }
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", earned ? "text-primary" : "text-muted")}>{tier.label}</p>
                  <p className="text-[10px] text-muted">{tier.min} points</p>
                </div>
                {earned && (
                  <span className="text-[10px] text-brand-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 size={9} /> Earned
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
