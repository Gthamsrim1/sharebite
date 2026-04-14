import { create } from "zustand";
import { FoodItem, SharedListing, Notification, UserProfile } from "@/lib/types";
import { mockFoodItems, mockSharedListings, mockNotifications, mockUserProfile } from "@/lib/mockData";

interface AppState {
  foodItems: FoodItem[];
  sharedListings: SharedListing[];
  notifications: Notification[];
  profile: UserProfile;
  darkMode: boolean;
  addFoodItem: (item: FoodItem) => void;
  removeFoodItem: (id: string) => void;
  shareItem: (id: string, pickupCode: string) => void;
  claimListing: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Notification) => void;
  toggleDarkMode: () => void;
  addPoints: (pts: number) => void;
}

export const useStore = create<AppState>((set) => ({
  foodItems: mockFoodItems,
  sharedListings: mockSharedListings,
  notifications: mockNotifications,
  profile: mockUserProfile,
  darkMode: false,

  addFoodItem: (item) => set((s) => ({ foodItems: [item, ...s.foodItems] })),

  removeFoodItem: (id) => set((s) => ({ foodItems: s.foodItems.filter((f) => f.id !== id) })),

  shareItem: (id, pickupCode) =>
    set((s) => {
      const item = s.foodItems.find((f) => f.id === id);
      if (!item) return s;
      const newListing: SharedListing = {
        id: `s-${Date.now()}`,
        foodName: item.name,
        category: item.category,
        quantity: `${item.quantity} ${item.unit}`,
        expiryDate: item.expiryDate,
        daysLeft: item.daysLeft,
        postedAt: new Date().toISOString(),
        apartmentHint: s.profile.apartmentCode,
        pickupCode,
        isClaimed: false,
      };
      return {
        foodItems: s.foodItems.map((f) =>
          f.id === id ? { ...f, isShared: true, pickupCode, sharedAt: new Date().toISOString() } : f
        ),
        sharedListings: [newListing, ...s.sharedListings],
        profile: { ...s.profile, points: s.profile.points + 30, itemsShared: s.profile.itemsShared + 1 },
      };
    }),

  claimListing: (id) =>
    set((s) => ({
      sharedListings: s.sharedListings.map((l) =>
        l.id === id ? { ...l, isClaimed: true, claimedAt: new Date().toISOString() } : l
      ),
      profile: { ...s.profile, points: s.profile.points + 20, itemsClaimed: s.profile.itemsClaimed + 1 },
    })),

  markNotificationRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n) })),

  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })) })),

  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),

  toggleDarkMode: () =>
    set((s) => {
      const next = !s.darkMode;
      if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", next);
      return { darkMode: next };
    }),

  addPoints: (pts) => set((s) => ({ profile: { ...s.profile, points: s.profile.points + pts } })),
}));
