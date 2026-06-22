export type ShopType = "friday_bulk" | "weekday_online";

export interface Household {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  household_id: string | null;
  created_at: string;
}

export interface Ingredient {
  id: string;
  household_id: string;
  name: string;
  category: string;
  unit: string;
  shelf_life_days: number;
  is_staple: boolean;
  created_at: string;
}

export interface Recipe {
  id: string;
  household_id: string;
  name: string;
  meal_type: string;
  ingredient_ids: string[];
  servings: number;
  created_at: string;
}

export interface MealPlan {
  id: string;
  household_id: string;
  week_start: string;
  created_by: string | null;
  created_at: string;
}

export interface MealPlanItem {
  id: string;
  meal_plan_id: string;
  day_of_week: number;
  meal_type: string;
  recipe_id: string | null;
  recipe_name: string;
  cook_assignee: string | null;
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  meal_plan_id: string;
  ingredient_id: string | null;
  name: string;
  quantity: string;
  unit: string;
  shop_type: ShopType;
  checked: boolean;
  created_at: string;
}

export interface HealthLog {
  id: string;
  user_id: string;
  household_id: string;
  log_date: string;
  weight: number | null;
  mood: number | null;
  mood_note: string | null;
  period_active: boolean;
  period_symptoms: string | null;
  sleep_start: string | null;
  sleep_end: string | null;
  sleep_quality: number | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExerciseLog {
  id: string;
  user_id: string;
  household_id: string;
  log_date: string;
  exercise_type: string;
  duration_minutes: number;
  notes: string | null;
  is_private: boolean;
  created_at: string;
}

export const DAY_NAMES = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export const MOOD_LABELS: Record<number, string> = {
  1: "😞 很差",
  2: "😕 不太好",
  3: "😐 一般",
  4: "🙂 不错",
  5: "😄 很好",
};

export const EXERCISE_TYPES = [
  "跑步", "力量训练", "瑜伽", "游泳", "骑行", "散步", "跳绳", "其他",
];

export const INGREDIENT_CATEGORIES = [
  "蔬菜", "菌菇", "肉类", "海鲜", "蛋类", "乳制品", "饮品", "主食", "水果", "其他",
];
