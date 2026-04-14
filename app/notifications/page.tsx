"use client";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { Bell, AlertTriangle, Info, CheckCircle2, AlertCircle, CheckCheck, BarChart2 } from "lucide-react";
import { Notification } from "@/lib/types";

const TYPE_CONFIG = {
  urgent: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/20", border: "border-rose-200 dark:border-rose-800" },
  warning: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
  info: { icon: Info, color: "text-brand-500", bg: "bg-brand-100 dark:bg-brand-900/20", border: "border-brand-200 dark:border-brand-800" },
  success: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800" },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead } = useStore();
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="px-5 pb-8">
      <PageHeader
        title="Alerts"
        subtitle={unread > 0 ? `${unread} unread notifications` : "All caught up!"}
        action={unread > 0 ? (
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-brand-600 font-medium hover:text-brand-700 transition-colors">
            <CheckCheck size={12} />Mark all read
          </button>
        ) : undefined}
      />

      {notifications.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <Bell size={40} className="text-stone-300 dark:text-stone-600 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm font-medium text-primary mb-1">No notifications yet</p>
          <p className="text-xs text-muted">We'll alert you when food needs attention</p>
        </div>
      ) : (
        <>
          {unread > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2 px-1">Unread</p>
              <div className="space-y-2">
                {notifications.filter((n) => !n.isRead).map((n, i) => (
                  <NotificationCard key={n.id} notification={n} delay={i} onRead={() => markNotificationRead(n.id)} />
                ))}
              </div>
            </div>
          )}
          {notifications.some((n) => n.isRead) && (
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 px-1">Earlier</p>
              <div className="space-y-2">
                {notifications.filter((n) => n.isRead).map((n, i) => (
                  <NotificationCard key={n.id} notification={n} delay={i} onRead={() => {}} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-6 card p-4 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/20 rounded-lg flex items-center justify-center shrink-0">
            <Bell size={14} className="text-brand-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary mb-0.5">Smart Reminder Schedule</p>
            <p className="text-xs text-muted leading-relaxed">
              You get notified at <span className="text-secondary font-medium">5 days</span>, <span className="text-secondary font-medium">2 days</span>, and on the <span className="text-secondary font-medium">expiry day</span>.
            </p>
          </div>
        </div>
      </div>

      <PollWidget />
    </div>
  );
}

function NotificationCard({ notification, delay, onRead }: { notification: Notification; delay: number; onRead: () => void }) {
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.icon;
  return (
    <div onClick={onRead}
      className={cn("card p-4 flex items-start gap-3 cursor-pointer transition-all animate-fade-in-up hover:shadow-sm",
        `stagger-${Math.min(delay + 1, 6)}`,
        !notification.isRead && "ring-1 ring-brand-200 dark:ring-brand-800"
      )}>
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", config.bg, config.border)}>
        <Icon size={16} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-primary">{notification.title}</p>
          {!notification.isRead && <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
        </div>
        <p className="text-xs text-secondary leading-relaxed mt-0.5">{notification.message}</p>
        <p className="text-[10px] text-muted mt-1.5">{notification.time}</p>
      </div>
    </div>
  );
}

function PollWidget() {
  const [voted, setVoted] = useState<string | null>(null);
  const options = ["Very useful", "Somewhat useful", "Not sure", "Not useful"];
  return (
    <div className="mt-6 card p-5 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
          <BarChart2 size={14} className="text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-primary">Quick Poll · Concept Validation</p>
          <p className="text-[10px] text-muted">Help us improve ShareBite</p>
        </div>
      </div>
      <p className="text-sm text-secondary mb-3">How useful are smart food expiry alerts to you?</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <button key={opt} onClick={() => setVoted(opt)}
            className={cn("w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all border",
              voted === opt
                ? "bg-brand-50 dark:bg-brand-950/20 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-400"
                : "bg-subtle border-transparent text-secondary hover:border-default"
            )}>
            {voted === opt
              ? <span className="flex items-center gap-2"><CheckCircle2 size={11} className="text-brand-600" />{opt}</span>
              : opt
            }
          </button>
        ))}
      </div>
      {voted && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <CheckCircle2 size={12} className="text-brand-600" />
          <p className="text-xs text-brand-600 font-medium">Thanks for your feedback!</p>
        </div>
      )}
    </div>
  );
}
