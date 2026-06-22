"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/providers/app-provider";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { cn, formatWeekRange, getWeekStart, formatDate } from "@/lib/utils";
import {
  matchRecipes,
  assignRecipesToWeek,
  buildShoppingList,
} from "@/lib/meal-plan";
import type { Ingredient, Recipe, MealPlanItem } from "@/lib/types";
import { DAY_NAMES } from "@/lib/types";
import { ChevronLeft, ChevronRight, Sparkles, Check } from "lucide-react";
import { addWeeks, subWeeks } from "date-fns";

export default function PlanPage() {
  const { profile, household } = useApp();
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mealPlanId, setMealPlanId] = useState<string | null>(null);
  const [planItems, setPlanItems] = useState<MealPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const supabase = createClient();

  const weekStartStr = formatDate(weekStart);

  const loadData = useCallback(async () => {
    if (!household) return;
    setLoading(true);

    const [{ data: ings }, { data: recs }, { data: plan }] = await Promise.all([
      supabase.from("ingredients").select("*").eq("household_id", household.id).order("category"),
      supabase.from("recipes").select("*").eq("household_id", household.id),
      supabase.from("meal_plans").select("*").eq("household_id", household.id).eq("week_start", weekStartStr).maybeSingle(),
    ]);

    setIngredients(ings ?? []);
    setRecipes(recs ?? []);

    if (plan) {
      setMealPlanId(plan.id);
      const [{ data: selected }, { data: items }] = await Promise.all([
        supabase.from("meal_plan_ingredients").select("ingredient_id").eq("meal_plan_id", plan.id),
        supabase.from("meal_plan_items").select("*").eq("meal_plan_id", plan.id).order("day_of_week"),
      ]);
      setSelectedIds(new Set((selected ?? []).map((s) => s.ingredient_id)));
      setPlanItems(items ?? []);
    } else {
      setMealPlanId(null);
      setSelectedIds(new Set());
      setPlanItems([]);
    }

    setLoading(false);
  }, [household, weekStartStr, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleIngredient = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const ensureMealPlan = async (): Promise<string | null> => {
    if (!household || !profile) return null;
    if (mealPlanId) return mealPlanId;

    const { data: plan, error } = await supabase
      .from("meal_plans")
      .insert({ household_id: household.id, week_start: weekStartStr, created_by: profile.id })
      .select()
      .single();

    if (error || !plan) return null;
    setMealPlanId(plan.id);
    return plan.id;
  };

  const saveSelectedIngredients = async (planId: string) => {
    await supabase.from("meal_plan_ingredients").delete().eq("meal_plan_id", planId);
    if (selectedIds.size > 0) {
      await supabase.from("meal_plan_ingredients").insert(
        Array.from(selectedIds).map((ingredient_id) => ({ meal_plan_id: planId, ingredient_id }))
      );
    }
  };

  const handleGenerate = async () => {
    if (selectedIds.size === 0) return;
    setGenerating(true);

    const planId = await ensureMealPlan();
    if (!planId) { setGenerating(false); return; }

    await saveSelectedIngredients(planId);

    const matched = matchRecipes(recipes, ingredients, selectedIds);
    const assignments = assignRecipesToWeek(matched);

    await supabase.from("meal_plan_items").delete().eq("meal_plan_id", planId);

    if (assignments.length > 0) {
      const items = assignments.map(({ day, recipe }) => ({
        meal_plan_id: planId,
        day_of_week: day,
        meal_type: "晚餐",
        recipe_id: recipe.id,
        recipe_name: recipe.name,
      }));
      await supabase.from("meal_plan_items").insert(items);
    }

    const shopping = buildShoppingList(ingredients, selectedIds);
    await supabase.from("shopping_items").delete().eq("meal_plan_id", planId);
    if (shopping.length > 0) {
      await supabase.from("shopping_items").insert(
        shopping.map((s) => ({ meal_plan_id: planId, ...s }))
      );
    }

    await loadData();
    setGenerating(false);
  };

  const grouped = ingredients.reduce<Record<string, Ingredient[]>>((acc, ing) => {
    (acc[ing.category] ??= []).push(ing);
    return acc;
  }, {});

  const matchedCount = matchRecipes(recipes, ingredients, selectedIds).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="本周食谱" />

      <div className="page-container space-y-4">
        {/* 周切换 */}
        <div className="flex items-center justify-between">
          <button onClick={() => setWeekStart(subWeeks(weekStart, 1))} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-700">{formatWeekRange(weekStart)}</span>
          <button onClick={() => setWeekStart(addWeeks(weekStart, 1))} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-8">加载中...</p>
        ) : (
          <>
            {/* 食材选择 */}
            <Card>
              <CardTitle className="mb-3">选择本周食材</CardTitle>
              <p className="text-xs text-gray-400 mb-3">勾选想吃的食材，系统会生成菜谱和采购清单</p>
              <div className="space-y-3">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((ing) => {
                        const selected = selectedIds.has(ing.id);
                        return (
                          <button
                            key={ing.id}
                            onClick={() => toggleIngredient(ing.id)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm border transition-colors flex items-center gap-1",
                              selected
                                ? "bg-brand-500 text-white border-brand-500"
                                : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                            )}
                          >
                            {selected && <Check className="w-3 h-3" />}
                            {ing.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  已选 {selectedIds.size} 种食材，可匹配 {matchedCount} 道菜
                </span>
                <Button
                  size="sm"
                  onClick={handleGenerate}
                  disabled={selectedIds.size === 0 || generating}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {generating ? "生成中..." : "生成食谱"}
                </Button>
              </div>
            </Card>

            {/* 周食谱 */}
            {planItems.length > 0 && (
              <Card>
                <CardTitle className="mb-3">本周菜单</CardTitle>
                <div className="space-y-2">
                  {planItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-brand-600 w-8">
                          {DAY_NAMES[item.day_of_week]}
                        </span>
                        <span className="text-sm">{item.recipe_name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{item.meal_type}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {planItems.length === 0 && selectedIds.size > 0 && (
              <p className="text-center text-gray-400 text-sm py-4">
                选好食材后，点击「生成食谱」
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
