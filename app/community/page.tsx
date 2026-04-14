"use client";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import PageHeader from "@/components/shared/PageHeader";
import WhyTooltip from "@/components/shared/WhyTooltip";
import FeedbackWidget from "@/components/shared/FeedbackWidget";
import FoodIcon from "@/components/shared/FoodIcon";
import { SharedListing } from "@/lib/types";
import { formatDate, cn, timeAgo } from "@/lib/utils";
import { Users, Clock, CheckCircle2, KeyRound, Search, PartyPopper } from "lucide-react";
import { toast } from "sonner";

type Tab = "available" | "claimed" | "all";

export default function CommunityPage() {
  const { sharedListings, claimListing, profile } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("available");
  const [search, setSearch] = useState("");
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimedCode, setClaimedCode] = useState<{ code: string; name: string } | null>(null);

  const filtered = sharedListings.filter((l) => {
    const matchSearch = l.foodName.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "available") return !l.isClaimed && matchSearch;
    if (activeTab === "claimed") return l.isClaimed && matchSearch;
    return matchSearch;
  });

  function handleClaim(listing: SharedListing) {
    claimListing(listing.id);
    setClaimingId(null);
    setClaimedCode({ code: listing.pickupCode, name: listing.foodName });
    toast.success(`${listing.foodName} claimed! +20 points`);
  }

  const availableCount = sharedListings.filter((l) => !l.isClaimed).length;

  return (
    <div className="px-5 pb-8">
      <PageHeader title="Community Board" subtitle="Share surplus, reduce waste together" />

      <div className="card p-4 mb-5 flex items-center gap-3 animate-fade-in-up stagger-1">
        <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/20 rounded-xl flex items-center justify-center shrink-0">
          <Users size={18} className="text-brand-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">{availableCount} items up for grabs</p>
          <p className="text-xs text-muted">Anonymous sharing · No identity revealed</p>
        </div>
        <WhyTooltip text="Anonymous sharing means you can offer food without awkwardness. The pickup code system keeps things private and simple." />
      </div>

      <div className="relative mb-4 animate-fade-in-up stagger-2">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search food items..."
          className="w-full bg-subtle border border-default rounded-xl pl-9 pr-4 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all" />
      </div>

      <div className="flex gap-2 mb-5 animate-fade-in-up stagger-3">
        {(["available", "claimed", "all"] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all",
              activeTab === tab ? "bg-brand-600 text-white shadow-sm" : "bg-subtle text-secondary hover:text-primary"
            )}>
            {tab === "available" ? `Available (${availableCount})` : tab === "claimed" ? "Claimed" : "All"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users size={28} className="text-brand-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-primary mb-1">Nothing here yet</p>
          <p className="text-xs text-muted">Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} delay={i}
              isCurrentUser={listing.apartmentHint === profile.apartmentCode}
              onClaim={() => setClaimingId(listing.id)} />
          ))}
        </div>
      )}

      {claimingId && (() => {
        const listing = sharedListings.find((l) => l.id === claimingId);
        if (!listing) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setClaimingId(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-card rounded-t-3xl p-6 shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-5" />
              <div className="flex justify-center mb-4">
                <FoodIcon category={listing.category} size="lg" />
              </div>
              <h3 className="font-display text-xl font-medium text-primary text-center mb-1">Claim {listing.foodName}</h3>
              <p className="text-sm text-muted text-center mb-5">
                Pick up from <strong className="text-secondary">{listing.apartmentHint}</strong> before {formatDate(listing.expiryDate)}
              </p>
              <div className="bg-subtle rounded-2xl p-4 mb-5 space-y-2">
                <InfoRow label="Quantity" value={listing.quantity} />
                <InfoRow label="Posted" value={timeAgo(listing.postedAt)} />
                <InfoRow label="Expires" value={`${listing.daysLeft} day(s)`} />
                <InfoRow label="Points Earned" value="+20 pts" accent />
              </div>
              <p className="text-xs text-muted text-center mb-4">After claiming, you'll get a pickup code to show the donor.</p>
              <button onClick={() => handleClaim(listing)}
                className="w-full bg-brand-600 text-white rounded-2xl py-3.5 font-semibold text-sm hover:bg-brand-700 active:scale-95 transition-all">
                Confirm Claim
              </button>
              <button onClick={() => setClaimingId(null)} className="w-full mt-2 py-3 text-sm text-muted hover:text-secondary transition-colors">
                Cancel
              </button>
            </div>
          </div>
        );
      })()}

      {claimedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5" onClick={() => setClaimedCode(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-card rounded-3xl p-6 shadow-2xl text-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PartyPopper size={28} className="text-brand-600" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl font-medium text-primary mb-1">You claimed it!</h3>
            <p className="text-sm text-muted mb-5">Show this code to collect <strong className="text-secondary">{claimedCode.name}</strong></p>
            <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-2 justify-center mb-2">
                <KeyRound size={14} className="text-brand-600" />
                <p className="text-xs text-brand-600 font-semibold uppercase tracking-widest">Pickup Code</p>
              </div>
              <p className="font-mono text-3xl font-bold text-brand-700 dark:text-brand-400 tracking-[0.3em]">{claimedCode.code}</p>
            </div>
            <button onClick={() => setClaimedCode(null)} className="w-full bg-brand-600 text-white rounded-2xl py-3 font-semibold text-sm hover:bg-brand-700 transition-all">
              Done
            </button>
          </div>
        </div>
      )}

      <FeedbackWidget />
    </div>
  );
}

function ListingCard({ listing, delay, isCurrentUser, onClaim }: {
  listing: SharedListing; delay: number; isCurrentUser: boolean; onClaim: () => void;
}) {
  return (
    <div className={cn("card p-4 animate-fade-in-up transition-shadow hover:shadow-sm", `stagger-${Math.min(delay + 1, 6)}`, listing.isClaimed && "opacity-60")}>
      <div className="flex items-start gap-3">
        <FoodIcon category={listing.category} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-primary">{listing.foodName}</p>
            {listing.isClaimed && (
              <span className="text-[10px] font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 flex items-center gap-0.5">
                <CheckCircle2 size={8} /> Claimed
              </span>
            )}
            {isCurrentUser && (
              <span className="text-[10px] font-medium text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">You</span>
            )}
          </div>
          <p className="text-xs text-muted">{listing.quantity} · {listing.apartmentHint}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border",
              listing.daysLeft <= 2 ? "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800" :
              listing.daysLeft <= 5 ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" :
              "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            )}>
              {listing.daysLeft <= 0 ? "Expires today" : `${listing.daysLeft}d left`}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted">
              <Clock size={9} />{timeAgo(listing.postedAt)}
            </span>
          </div>
        </div>
        {!listing.isClaimed && !isCurrentUser && (
          <button onClick={onClaim} className="shrink-0 px-3 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 active:scale-95 transition-all shadow-sm shadow-brand-600/20">
            Claim
          </button>
        )}
      </div>
    </div>
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
