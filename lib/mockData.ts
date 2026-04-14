import { FoodItem, SharedListing, Notification, UserProfile, LeaderboardEntry, WasteAnalytic } from "./types";

export const mockFoodItems: FoodItem[] = [
  {
    id: "1", name: "Organic Milk", category: "dairy", quantity: 1, unit: "litre",
    purchaseDate: "2025-01-08", expiryDate: "2025-01-15", status: "urgent", daysLeft: 2,
    aiSuggestion: "Add to a smoothie or bake something today.", isShared: false,
  },
  {
    id: "2", name: "Cherry Tomatoes", category: "produce", quantity: 250, unit: "g",
    purchaseDate: "2025-01-10", expiryDate: "2025-01-18", status: "soon", daysLeft: 5,
    aiSuggestion: "Plan to use in the next 5 days. Consider sharing if surplus.", isShared: false,
  },
  {
    id: "3", name: "Sourdough Bread", category: "grains", quantity: 1, unit: "loaf",
    purchaseDate: "2025-01-09", expiryDate: "2025-01-14", status: "urgent", daysLeft: 1,
    aiSuggestion: "Use today! Make toast, sandwiches, or share with a neighbor.",
    isShared: true, sharedAt: "2025-01-12T10:30:00Z", pickupCode: "XK7R4M",
  },
  {
    id: "4", name: "Greek Yogurt", category: "dairy", quantity: 500, unit: "g",
    purchaseDate: "2025-01-11", expiryDate: "2025-01-25", status: "fresh", daysLeft: 12,
    aiSuggestion: "Greek Yogurt is fresh for 12 more days. You're all good!", isShared: false,
  },
  {
    id: "5", name: "Baby Spinach", category: "produce", quantity: 150, unit: "g",
    purchaseDate: "2025-01-09", expiryDate: "2025-01-13", status: "urgent", daysLeft: 0,
    aiSuggestion: "Use Baby Spinach today — it expires at midnight!", isShared: false,
  },
  {
    id: "6", name: "Brown Rice", category: "grains", quantity: 1, unit: "kg",
    purchaseDate: "2024-12-01", expiryDate: "2025-06-01", status: "fresh", daysLeft: 138,
    aiSuggestion: "Brown Rice is fresh for 138 more days. You're all good!", isShared: false,
  },
  {
    id: "7", name: "Free Range Eggs", category: "dairy", quantity: 6, unit: "eggs",
    purchaseDate: "2025-01-06", expiryDate: "2025-01-20", status: "soon", daysLeft: 7,
    aiSuggestion: "Plan to use in the next 7 days.", isShared: false,
  },
  {
    id: "8", name: "Leftover Dal", category: "leftovers", quantity: 2, unit: "servings",
    purchaseDate: "2025-01-11", expiryDate: "2025-01-13", status: "urgent", daysLeft: 0,
    aiSuggestion: "Eat Leftover Dal today before it turns. Don't waste it!", isShared: false,
  },
];

export const mockSharedListings: SharedListing[] = [
  {
    id: "s1", foodName: "Sourdough Bread", category: "grains", quantity: "1 loaf",
    expiryDate: "2025-01-14", daysLeft: 1, postedAt: "2025-01-12T10:30:00Z",
    apartmentHint: "Floor 3", pickupCode: "XK7R4M", isClaimed: false,
  },
  {
    id: "s2", foodName: "Mango Pickle", category: "condiments", quantity: "Half jar",
    expiryDate: "2025-03-15", daysLeft: 61, postedAt: "2025-01-11T16:00:00Z",
    apartmentHint: "Floor 1", pickupCode: "PQ9WX2", isClaimed: false,
  },
  {
    id: "s3", foodName: "Bananas", category: "produce", quantity: "4 pieces",
    expiryDate: "2025-01-15", daysLeft: 2, postedAt: "2025-01-12T08:15:00Z",
    apartmentHint: "Floor 5", pickupCode: "TY3NL8", isClaimed: true, claimedAt: "2025-01-12T09:00:00Z",
  },
  {
    id: "s4", foodName: "Oat Milk", category: "beverages", quantity: "700ml",
    expiryDate: "2025-01-20", daysLeft: 7, postedAt: "2025-01-12T07:00:00Z",
    apartmentHint: "Floor 2", pickupCode: "AM5VR1", isClaimed: false,
  },
  {
    id: "s5", foodName: "Pasta Salad", category: "leftovers", quantity: "3 servings",
    expiryDate: "2025-01-13", daysLeft: 0, postedAt: "2025-01-12T12:00:00Z",
    apartmentHint: "Floor 4", pickupCode: "ZB6HJ9", isClaimed: false,
  },
];

export const mockNotifications: Notification[] = [
  { id: "n1", type: "urgent", title: "Expiring Today!", message: "Baby Spinach expires today. Use it or share it now.", time: "2 hours ago", isRead: false, foodItemId: "5" },
  { id: "n2", type: "urgent", title: "Expiring Today!", message: "Leftover Dal — eat today before it goes bad.", time: "3 hours ago", isRead: false, foodItemId: "8" },
  { id: "n3", type: "warning", title: "Expiring Soon", message: "Sourdough Bread has 1 day left. You've shared it — great job!", time: "5 hours ago", isRead: false, foodItemId: "3" },
  { id: "n4", type: "success", title: "Your Share was Claimed!", message: "Someone picked up your Bananas. You earned 50 points!", time: "1 day ago", isRead: true },
  { id: "n5", type: "info", title: "New Sharing on the Board", message: "A neighbor shared Oat Milk (700ml). Check the community board!", time: "1 day ago", isRead: true },
  { id: "n6", type: "warning", title: "Weekly Summary", message: "This week: 3 items saved, 2 shared, 0 wasted. Keep it up!", time: "2 days ago", isRead: true },
];

export const mockUserProfile: UserProfile = {
  id: "u1", alias: "GreenLeaf42", apartmentCode: "APT-3B", points: 1240,
  wasteReduced: 4.2, itemsShared: 18, itemsClaimed: 7, streak: 12, rank: 3,
  badge: "Eco Warrior", joinedAt: "2024-09-01",
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, alias: "SunflowerSeed", points: 2100, itemsShared: 34, badge: "Champion", isCurrentUser: false },
  { rank: 2, alias: "MintLeaf99", points: 1580, itemsShared: 25, badge: "Super Sharer", isCurrentUser: false },
  { rank: 3, alias: "GreenLeaf42", points: 1240, itemsShared: 18, badge: "Eco Warrior", isCurrentUser: true },
  { rank: 4, alias: "TerracottaFarm", points: 980, itemsShared: 15, badge: "Grower", isCurrentUser: false },
  { rank: 5, alias: "CoconutRain", points: 750, itemsShared: 12, badge: "Grower", isCurrentUser: false },
  { rank: 6, alias: "BasilByte", points: 620, itemsShared: 9, badge: "Grower", isCurrentUser: false },
  { rank: 7, alias: "ClovesNSalt", points: 410, itemsShared: 6, badge: "Starter", isCurrentUser: false },
];

export const mockWasteAnalytics: WasteAnalytic[] = [
  { month: "Sep", wasted: 12, saved: 4, shared: 2 },
  { month: "Oct", wasted: 9, saved: 6, shared: 4 },
  { month: "Nov", wasted: 7, saved: 9, shared: 6 },
  { month: "Dec", wasted: 5, saved: 11, shared: 9 },
  { month: "Jan", wasted: 3, saved: 14, shared: 12 },
];
