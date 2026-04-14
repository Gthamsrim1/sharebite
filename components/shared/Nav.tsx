"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, PlusCircle, Bell, User } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/add-food", icon: PlusCircle, label: "Add", accent: true },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Nav() {
  const pathname = usePathname();
  const notifications = useStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <div className="glass border-t border-default mx-0 px-2 py-2 flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label, accent }) => {
          const isActive = pathname === href;
          const showBadge = href === "/notifications" && unread > 0;
          return (
            <Link key={href} href={href} className="flex-1">
              <div className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200",
                accent
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 scale-110"
                  : isActive
                  ? "text-brand-600"
                  : "text-muted hover:text-secondary"
              )}>
                <div className="relative">
                  <Icon size={accent ? 22 : 20} strokeWidth={isActive || accent ? 2.5 : 1.8} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium leading-none",
                  accent && "text-white"
                )}>{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
