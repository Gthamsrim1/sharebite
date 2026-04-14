export type FoodCategory =
  | "dairy"
  | "produce"
  | "meat"
  | "grains"
  | "beverages"
  | "snacks"
  | "frozen"
  | "condiments"
  | "leftovers"
  | "other";

export type ExpiryStatus = "fresh" | "soon" | "urgent" | "expired";

export type FoodItem = {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  status: ExpiryStatus;
  daysLeft: number;
  aiSuggestion: string;
  isShared: boolean;
  sharedAt?: string;
  pickupCode?: string;
};

export type SharedListing = {
  id: string;
  foodName: string;
  category: FoodCategory;
  quantity: string;
  expiryDate: string;
  daysLeft: number;
  postedAt: string;
  apartmentHint: string;
  pickupCode: string;
  isClaimed: boolean;
  claimedAt?: string;
};

export type Notification = {
  id: string;
  type: "urgent" | "warning" | "info" | "success";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  foodItemId?: string;
};

export type UserProfile = {
  id: string;
  alias: string;
  apartmentCode: string;
  points: number;
  wasteReduced: number;
  itemsShared: number;
  itemsClaimed: number;
  streak: number;
  rank: number;
  badge: string;
  joinedAt: string;
};

export type LeaderboardEntry = {
  rank: number;
  alias: string;
  points: number;
  itemsShared: number;
  badge: string;
  isCurrentUser: boolean;
};

export type WasteAnalytic = {
  month: string;
  wasted: number;
  saved: number;
  shared: number;
};
