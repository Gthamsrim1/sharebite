import { FoodCategory, ExpiryStatus } from "./types";

const EXPIRY_DAYS: Record<FoodCategory, { min: number; max: number }> = {
  dairy: { min: 5, max: 14 },
  produce: { min: 3, max: 10 },
  meat: { min: 2, max: 5 },
  grains: { min: 90, max: 365 },
  beverages: { min: 14, max: 90 },
  snacks: { min: 30, max: 180 },
  frozen: { min: 60, max: 180 },
  condiments: { min: 60, max: 365 },
  leftovers: { min: 2, max: 5 },
  other: { min: 7, max: 30 },
};

export function predictExpiry(category: FoodCategory, purchaseDate: string): string {
  const range = EXPIRY_DAYS[category];
  const variance = Math.floor(Math.random() * (range.max - range.min)) + range.min;
  const purchase = new Date(purchaseDate);
  purchase.setDate(purchase.getDate() + variance);
  return purchase.toISOString().split("T")[0];
}

export function getExpiryStatus(daysLeft: number): ExpiryStatus {
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 2) return "urgent";
  if (daysLeft <= 5) return "soon";
  return "fresh";
}

export function getDaysLeft(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getAISuggestion(name: string, daysLeft: number, category: FoodCategory): string {
  if (daysLeft < 0) return `${name} has expired. Consider composting it.`;
  if (daysLeft === 0) return `Use ${name} today — it expires at midnight!`;
  if (daysLeft <= 2) {
    const suggestions: Record<FoodCategory, string> = {
      dairy: `Add ${name} to a smoothie or bake something today.`,
      produce: `Stir-fry or blend ${name} into a quick meal today.`,
      meat: `Cook ${name} immediately or freeze it now.`,
      grains: `${name} still has time, but use it in tonight's meal.`,
      beverages: `Drink or share ${name} with a neighbor today.`,
      snacks: `Snack on ${name} today — share if you can't finish!`,
      frozen: `Thaw and cook ${name} within the next 2 days.`,
      condiments: `Use ${name} generously in today's cooking.`,
      leftovers: `Eat ${name} today before it turns. Don't waste it!`,
      other: `Use or share ${name} urgently — expiry is imminent.`,
    };
    return suggestions[category];
  }
  if (daysLeft <= 5) {
    return `Plan to use ${name} in the next ${daysLeft} days. Consider sharing if you have surplus.`;
  }
  return `${name} is fresh for ${daysLeft} more days. You're all good!`;
}

export function generatePickupCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
