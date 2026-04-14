import {
  Milk, Apple, Beef, Wheat, Coffee, Cookie, Snowflake,
  Archive, UtensilsCrossed, Package, Salad, Egg, Droplets,
  Soup, Sandwich, Carrot, Fish, Cherry
} from "lucide-react";
import { FoodCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<FoodCategory, React.ElementType> = {
  dairy: Milk,
  produce: Apple,
  meat: Beef,
  grains: Wheat,
  beverages: Coffee,
  snacks: Cookie,
  frozen: Snowflake,
  condiments: Archive,
  leftovers: UtensilsCrossed,
  other: Package,
};

const CATEGORY_COLORS: Record<FoodCategory, string> = {
  dairy: "text-sky-500 bg-sky-50 dark:bg-sky-950/30",
  produce: "text-green-500 bg-green-50 dark:bg-green-950/30",
  meat: "text-rose-500 bg-rose-50 dark:bg-rose-950/30",
  grains: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  beverages: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30",
  snacks: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
  frozen: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
  condiments: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
  leftovers: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
  other: "text-stone-500 bg-stone-100 dark:bg-stone-800",
};

interface FoodIconProps {
  category: FoodCategory;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { container: "w-8 h-8 rounded-lg", icon: 14 },
  md: { container: "w-12 h-12 rounded-xl", icon: 20 },
  lg: { container: "w-16 h-16 rounded-2xl", icon: 28 },
};

export default function FoodIcon({ category, size = "md", className }: FoodIconProps) {
  const Icon = CATEGORY_ICONS[category];
  const colors = CATEGORY_COLORS[category];
  const { container, icon } = SIZES[size];

  return (
    <div className={cn("flex items-center justify-center shrink-0", container, colors, className)}>
      <Icon size={icon} strokeWidth={1.8} />
    </div>
  );
}

export function getCategoryIcon(category: FoodCategory): React.ElementType {
  return CATEGORY_ICONS[category];
}

export function getCategoryColor(category: FoodCategory): string {
  return CATEGORY_COLORS[category];
}
