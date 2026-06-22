"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/providers/app-provider";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardTitle } from "@/components/ui/card";
import { formatWeekRange, getWeekStart, formatDate } from "@/lib/utils";
import type { ShoppingItem } from "@/lib/types";
import { Store, Truck, Check, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { addWeeks, subWeeks } from "date-fns";

export default function ShopPage() {
  const { household } = useApp();
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [fridayItems, setFridayItems] = useState<ShoppingItem[]>([]);
  const [weekdayItems, setWeekdayItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const weekStartStr = formatDate(weekStart);

  const loadData = useCallback(async () => {
    if (!household) return;
    setLoading(true);

    const { data: plan } = await supabase
      .from("meal_plans")
      .select("id")
      .eq("household_id", household.id)
      .eq("week_start", weekStartStr)
      .maybeSingle();

    if (!plan) {
      setFridayItems([]);
      setWeekdayItems([]);
      setLoading(false);
      return;
    }

    const { data: items } = await supabase
      .from("shopping_items")
      .select("*")
      .eq("meal_plan_id", plan.id)
      .order("name");

    const all = items ?? [];
    setFridayItems(all.filter((i) => i.shop_type === "friday_bulk"));
    setWeekdayItems(all.filter((i) => i.shop_type === "weekday_online"));
    setLoading(false);
  }, [household, weekStartStr, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleItem = async (item: ShoppingItem) => {
    await supabase
      .from("shopping_items")
      .update({ checked: !item.checked })
      .eq("id", item.id);
    await loadData();
  };

  const copyList = async (items: ShoppingItem[], title: string) => {
    const text = items
      .filter((i) => !i.checked)
      .map((i) => `${i.name} ${i.quantity}${i.unit}`)
      .join("\n");
    const full = `【${title}】\n${text || "全部已采购 ✓"}`;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderList = (items: ShoppingItem[], title: string, icon: React.ReactNode, desc: string) => {
    const unchecked = items.filter((i) => !i.checked);
    const checked = items.filter((i) => i.checked);

    return (
      <Card>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle>{title}</CardTitle>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => copyList(items, title)}
              className="text-xs text-brand-600 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? "已复制" : "复制清单"}
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-3">{desc}</p>

        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            请先在「食谱」页生成本周计划
          </p>
        ) : (
          <div className="space-y-1">
            {unchecked.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item)}
                className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                <span className="text-sm flex-1">{item.name}</span>
                <span className="text-xs text-gray-400">{item.quantity}{item.unit}</span>
              </button>
            ))}
            {checked.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item)}
                className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl text-left opacity-50"
              >
                <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm flex-1 line-through">{item.name}</span>
                <span className="text-xs text-gray-400">{item.quantity}{item.unit}</span>
              </button>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            {checked.length}/{items.length} 已采购
          </p>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="采购清单" />

      <div className="page-container space-y-4">
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
            {renderList(
              fridayItems,
              "周五大采购",
              <Store className="w-5 h-5 text-brand-500" />,
              "线下超市 · 一周耐储存食材囤货"
            )}
            {renderList(
              weekdayItems,
              "周中线上补货",
              <Truck className="w-5 h-5 text-blue-500" />,
              "线上超市 · 易坏食材按需补充"
            )}
          </>
        )}
      </div>
    </div>
  );
}
