import type { Ingredient, Recipe } from "@/lib/types";

type DefaultIngredient = Omit<Ingredient, "id" | "household_id" | "created_at">;

export const DEFAULT_INGREDIENTS: DefaultIngredient[] = [
  // 蔬菜
  { name: "西兰花", category: "蔬菜", unit: "棵", shelf_life_days: 5, is_staple: true },
  { name: "花菜", category: "蔬菜", unit: "棵", shelf_life_days: 5, is_staple: true },
  { name: "青椒", category: "蔬菜", unit: "个", shelf_life_days: 7, is_staple: true },
  { name: "红椒", category: "蔬菜", unit: "个", shelf_life_days: 7, is_staple: true },
  { name: "莴笋", category: "蔬菜", unit: "根", shelf_life_days: 7, is_staple: true },
  { name: "莲藕", category: "蔬菜", unit: "节", shelf_life_days: 10, is_staple: true },
  { name: "冬瓜", category: "蔬菜", unit: "块", shelf_life_days: 14, is_staple: true },
  { name: "丝瓜", category: "蔬菜", unit: "根", shelf_life_days: 5, is_staple: false },
  { name: "油麦菜", category: "蔬菜", unit: "把", shelf_life_days: 3, is_staple: false },
  { name: "山药", category: "蔬菜", unit: "根", shelf_life_days: 14, is_staple: true },
  { name: "土豆", category: "蔬菜", unit: "个", shelf_life_days: 14, is_staple: true },
  { name: "甜玉米", category: "蔬菜", unit: "根", shelf_life_days: 5, is_staple: true },
  { name: "糯玉米", category: "蔬菜", unit: "根", shelf_life_days: 5, is_staple: true },
  { name: "黄瓜", category: "蔬菜", unit: "根", shelf_life_days: 5, is_staple: false },
  { name: "生菜", category: "蔬菜", unit: "棵", shelf_life_days: 3, is_staple: false },
  { name: "空心菜", category: "蔬菜", unit: "把", shelf_life_days: 3, is_staple: false },
  { name: "小青菜", category: "蔬菜", unit: "把", shelf_life_days: 3, is_staple: false },
  { name: "小白菜", category: "蔬菜", unit: "把", shelf_life_days: 3, is_staple: false },
  { name: "紫甘蓝", category: "蔬菜", unit: "棵", shelf_life_days: 7, is_staple: true },
  { name: "海带", category: "蔬菜", unit: "袋", shelf_life_days: 180, is_staple: true },
  { name: "魔芋", category: "蔬菜", unit: "盒", shelf_life_days: 30, is_staple: true },

  // 菌菇
  { name: "香菇", category: "菌菇", unit: "份", shelf_life_days: 5, is_staple: false },
  { name: "平菇", category: "菌菇", unit: "份", shelf_life_days: 5, is_staple: false },
  { name: "金针菇", category: "菌菇", unit: "份", shelf_life_days: 5, is_staple: false },

  // 肉类
  { name: "鸡胸肉", category: "肉类", unit: "克", shelf_life_days: 3, is_staple: true },
  { name: "鸡腿肉", category: "肉类", unit: "克", shelf_life_days: 3, is_staple: true },
  { name: "瘦牛肉", category: "肉类", unit: "克", shelf_life_days: 3, is_staple: true },
  { name: "肥牛", category: "肉类", unit: "克", shelf_life_days: 3, is_staple: true },
  { name: "猪瘦肉", category: "肉类", unit: "克", shelf_life_days: 3, is_staple: true },
  { name: "五花肉", category: "肉类", unit: "克", shelf_life_days: 3, is_staple: true },
  { name: "猪排骨", category: "肉类", unit: "克", shelf_life_days: 3, is_staple: true },
  { name: "鸭肉", category: "肉类", unit: "克", shelf_life_days: 3, is_staple: true },
  { name: "低脂牛肉丸", category: "肉类", unit: "包", shelf_life_days: 30, is_staple: true },
  { name: "低脂鱼丸", category: "肉类", unit: "包", shelf_life_days: 30, is_staple: true },

  // 海鲜
  { name: "鳕鱼", category: "海鲜", unit: "克", shelf_life_days: 2, is_staple: false },
  { name: "三文鱼", category: "海鲜", unit: "克", shelf_life_days: 2, is_staple: false },
  { name: "鱼胶", category: "海鲜", unit: "份", shelf_life_days: 5, is_staple: false },

  // 乳制品
  { name: "酸奶", category: "乳制品", unit: "盒", shelf_life_days: 7, is_staple: false },
  { name: "无糖酸奶", category: "乳制品", unit: "盒", shelf_life_days: 7, is_staple: false },
  { name: "牛奶", category: "乳制品", unit: "盒", shelf_life_days: 7, is_staple: false },

  // 饮品
  { name: "豆浆", category: "饮品", unit: "盒", shelf_life_days: 5, is_staple: false },

  // 蛋类
  { name: "鸡蛋", category: "蛋类", unit: "个", shelf_life_days: 14, is_staple: true },

  // 主食
  { name: "自制面包", category: "主食", unit: "个", shelf_life_days: 3, is_staple: false },
  { name: "贝贝南瓜", category: "主食", unit: "个", shelf_life_days: 14, is_staple: true },
  { name: "芋头", category: "主食", unit: "个", shelf_life_days: 14, is_staple: true },
  { name: "红薯", category: "主食", unit: "个", shelf_life_days: 14, is_staple: true },
  { name: "紫薯", category: "主食", unit: "个", shelf_life_days: 14, is_staple: true },
  { name: "糙米饭", category: "主食", unit: "份", shelf_life_days: 2, is_staple: false },
  { name: "米粉", category: "主食", unit: "份", shelf_life_days: 30, is_staple: true },
  { name: "白米饭", category: "主食", unit: "份", shelf_life_days: 2, is_staple: false },
  { name: "河粉", category: "主食", unit: "份", shelf_life_days: 3, is_staple: false },
  { name: "红薯粉", category: "主食", unit: "份", shelf_life_days: 30, is_staple: true },
  { name: "绿豆粉", category: "主食", unit: "份", shelf_life_days: 30, is_staple: true },

  // 水果
  { name: "蓝莓", category: "水果", unit: "盒", shelf_life_days: 5, is_staple: false },
  { name: "小番茄", category: "水果", unit: "盒", shelf_life_days: 5, is_staple: false },
  { name: "香蕉", category: "水果", unit: "根", shelf_life_days: 5, is_staple: false },
  { name: "红心火龙果", category: "水果", unit: "个", shelf_life_days: 5, is_staple: false },
  { name: "西瓜", category: "水果", unit: "个", shelf_life_days: 5, is_staple: false },
  { name: "哈密瓜", category: "水果", unit: "个", shelf_life_days: 7, is_staple: true },
  { name: "荔枝", category: "水果", unit: "斤", shelf_life_days: 3, is_staple: false },

  // 其他
  { name: "坚果", category: "其他", unit: "袋", shelf_life_days: 90, is_staple: true },
];

interface DefaultRecipe {
  name: string;
  meal_type: string;
  ingredientNames: string[];
  servings: number;
}

export const DEFAULT_RECIPES: DefaultRecipe[] = [
  // 晚餐
  { name: "西兰花炒鸡胸肉", meal_type: "晚餐", ingredientNames: ["西兰花", "鸡胸肉"], servings: 2 },
  { name: "花菜炒鸡腿肉", meal_type: "晚餐", ingredientNames: ["花菜", "鸡腿肉"], servings: 2 },
  { name: "青椒炒瘦牛肉", meal_type: "晚餐", ingredientNames: ["青椒", "瘦牛肉"], servings: 2 },
  { name: "红椒炒肥牛", meal_type: "晚餐", ingredientNames: ["红椒", "肥牛"], servings: 2 },
  { name: "莴笋炒猪瘦肉", meal_type: "晚餐", ingredientNames: ["莴笋", "猪瘦肉"], servings: 2 },
  { name: "莲藕排骨汤", meal_type: "晚餐", ingredientNames: ["莲藕", "猪排骨"], servings: 2 },
  { name: "冬瓜炖鸭肉", meal_type: "晚餐", ingredientNames: ["冬瓜", "鸭肉"], servings: 2 },
  { name: "丝瓜炒鸡蛋", meal_type: "晚餐", ingredientNames: ["丝瓜", "鸡蛋"], servings: 2 },
  { name: "香菇滑鸡", meal_type: "晚餐", ingredientNames: ["香菇", "鸡胸肉"], servings: 2 },
  { name: "平菇炒五花肉", meal_type: "晚餐", ingredientNames: ["平菇", "五花肉"], servings: 2 },
  { name: "金针菇肥牛", meal_type: "晚餐", ingredientNames: ["金针菇", "肥牛"], servings: 2 },
  { name: "香煎鳕鱼", meal_type: "晚餐", ingredientNames: ["鳕鱼", "西兰花"], servings: 2 },
  { name: "三文鱼糙米饭", meal_type: "晚餐", ingredientNames: ["三文鱼", "糙米饭"], servings: 2 },
  { name: "芋头炖排骨", meal_type: "晚餐", ingredientNames: ["芋头", "猪排骨"], servings: 2 },
  { name: "低脂牛肉丸汤", meal_type: "晚餐", ingredientNames: ["低脂牛肉丸", "小青菜"], servings: 2 },
  { name: "河粉炒肥牛", meal_type: "晚餐", ingredientNames: ["河粉", "肥牛"], servings: 2 },
  { name: "海带排骨汤", meal_type: "晚餐", ingredientNames: ["海带", "猪排骨"], servings: 2 },
  { name: "魔芋鸡丝", meal_type: "晚餐", ingredientNames: ["魔芋", "鸡胸肉"], servings: 2 },
  { name: "鱼胶山药羹", meal_type: "晚餐", ingredientNames: ["鱼胶", "山药"], servings: 2 },
  { name: "玉米炒鸡腿", meal_type: "晚餐", ingredientNames: ["甜玉米", "鸡腿肉"], servings: 2 },
  { name: "低脂鱼丸河粉", meal_type: "晚餐", ingredientNames: ["低脂鱼丸", "河粉"], servings: 2 },
  { name: "土豆炖瘦牛肉", meal_type: "晚餐", ingredientNames: ["土豆", "瘦牛肉"], servings: 2 },

  // 午餐
  { name: "米粉炒瘦肉", meal_type: "午餐", ingredientNames: ["米粉", "猪瘦肉"], servings: 2 },
  { name: "红薯粉青菜汤", meal_type: "午餐", ingredientNames: ["红薯粉", "小青菜"], servings: 2 },
  { name: "紫甘蓝小番茄沙拉", meal_type: "午餐", ingredientNames: ["紫甘蓝", "小番茄"], servings: 2 },
  { name: "白米饭配西兰花鸡胸", meal_type: "午餐", ingredientNames: ["白米饭", "西兰花", "鸡胸肉"], servings: 2 },
  { name: "黄瓜鸡丝凉面", meal_type: "午餐", ingredientNames: ["黄瓜", "鸡胸肉", "米粉"], servings: 2 },

  // 早餐
  { name: "蒸紫薯", meal_type: "早餐", ingredientNames: ["紫薯"], servings: 2 },
  { name: "蒸贝贝南瓜", meal_type: "早餐", ingredientNames: ["贝贝南瓜"], servings: 2 },
  { name: "蒸红薯", meal_type: "早餐", ingredientNames: ["红薯"], servings: 2 },
  { name: "香蕉牛奶", meal_type: "早餐", ingredientNames: ["香蕉", "牛奶"], servings: 2 },
  { name: "蓝莓无糖酸奶", meal_type: "早餐", ingredientNames: ["蓝莓", "无糖酸奶"], servings: 2 },
  { name: "自制面包配豆浆", meal_type: "早餐", ingredientNames: ["自制面包", "豆浆"], servings: 2 },
  { name: "火龙果酸奶", meal_type: "早餐", ingredientNames: ["红心火龙果", "酸奶"], servings: 2 },
  { name: "水煮蛋", meal_type: "早餐", ingredientNames: ["鸡蛋"], servings: 2 },
];

export function matchRecipes(
  recipes: Recipe[],
  ingredients: Ingredient[],
  selectedIds: Set<string>
): Recipe[] {
  return recipes.filter((recipe) =>
    recipe.ingredient_ids.every((id) => selectedIds.has(id))
  );
}

export function assignRecipesToWeek(
  recipes: Recipe[],
  mealType = "晚餐"
): { day: number; recipe: Recipe }[] {
  const filtered = recipes.filter((r) => r.meal_type === mealType);
  if (filtered.length === 0) return [];

  const assignments: { day: number; recipe: Recipe }[] = [];
  for (let day = 0; day < 7; day++) {
    const recipe = filtered[day % filtered.length];
    assignments.push({ day, recipe });
  }
  return assignments;
}

export function buildShoppingList(
  ingredients: Ingredient[],
  selectedIds: Set<string>
): { name: string; ingredient_id: string; quantity: string; unit: string; shop_type: "friday_bulk" | "weekday_online" }[] {
  return ingredients
    .filter((i) => selectedIds.has(i.id))
    .map((i) => ({
      name: i.name,
      ingredient_id: i.id,
      quantity: i.is_staple ? "1" : "适量",
      unit: i.unit,
      shop_type: (i.is_staple || i.shelf_life_days >= 7 ? "friday_bulk" : "weekday_online") as "friday_bulk" | "weekday_online",
    }));
}

export async function seedHouseholdData(
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>,
  householdId: string
) {
  const { data: existing } = await supabase
    .from("ingredients")
    .select("id")
    .eq("household_id", householdId)
    .limit(1);

  if (existing && existing.length > 0) return;

  const ingredientRows = DEFAULT_INGREDIENTS.map((ing) => ({
    ...ing,
    household_id: householdId,
  }));

  const { data: insertedIngredients, error: ingError } = await supabase
    .from("ingredients")
    .insert(ingredientRows)
    .select();

  if (ingError || !insertedIngredients) return;

  const nameToId = new Map(insertedIngredients.map((i) => [i.name, i.id]));

  const recipeRows = DEFAULT_RECIPES
    .map((r) => ({
      household_id: householdId,
      name: r.name,
      meal_type: r.meal_type,
      ingredient_ids: r.ingredientNames
        .map((n) => nameToId.get(n))
        .filter(Boolean) as string[],
      servings: r.servings,
    }))
    .filter((r) => r.ingredient_ids.length > 0);

  await supabase.from("recipes").insert(recipeRows);
}
