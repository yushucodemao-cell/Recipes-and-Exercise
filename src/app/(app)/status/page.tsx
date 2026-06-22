"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/providers/app-provider";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardTitle } from "@/components/ui/card";
import { calcSleepHours } from "@/lib/utils";
import { MOOD_LABELS } from "@/lib/types";
import type { HealthLog, ExerciseLog, Profile } from "@/lib/types";
import { format, subDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Lock } from "lucide-react";

interface MemberStatus {
  profile: Profile;
  healthLogs: HealthLog[];
  exerciseLogs: ExerciseLog[];
}

export default function StatusPage() {
  const { profile, roommates } = useApp();
  const [members, setMembers] = useState<MemberStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    if (!profile) return;
    setLoading(true);

    const allMembers = roommates.length > 0 ? roommates : [profile];
    const since = format(subDays(new Date(), 6), "yyyy-MM-dd");

    const results: MemberStatus[] = [];

    for (const member of allMembers) {
      const [{ data: health }, { data: exercise }] = await Promise.all([
        supabase
          .from("health_logs")
          .select("*")
          .eq("user_id", member.id)
          .gte("log_date", since)
          .order("log_date", { ascending: false }),
        supabase
          .from("exercise_logs")
          .select("*")
          .eq("user_id", member.id)
          .gte("log_date", since)
          .order("log_date", { ascending: false }),
      ]);

      results.push({
        profile: member,
        healthLogs: health ?? [],
        exerciseLogs: exercise ?? [],
      });
    }

    setMembers(results);
    setLoading(false);
  }, [profile, roommates, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderMember = (member: MemberStatus) => {
    const isMe = member.profile.id === profile?.id;
    const latestHealth = member.healthLogs[0];
    const latestExercise = member.exerciseLogs[0];
    const weekExercises = member.exerciseLogs.length;
    const totalMinutes = member.exerciseLogs.reduce((s, e) => s + e.duration_minutes, 0);

    const weights = member.healthLogs
      .filter((h) => h.weight)
      .map((h) => ({ date: h.log_date, weight: h.weight! }));

    return (
      <Card key={member.profile.id}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-600">
            {member.profile.display_name[0]}
          </div>
          <CardTitle>
            {member.profile.display_name}
            {isMe && <span className="text-xs text-gray-400 font-normal ml-1">(我)</span>}
          </CardTitle>
        </div>

        {/* 今日概览 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">最近体重</p>
            <p className="text-lg font-bold">
              {latestHealth?.weight ? `${latestHealth.weight} kg` : "—"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">最近情绪</p>
            <p className="text-lg font-bold">
              {latestHealth?.mood ? MOOD_LABELS[latestHealth.mood] : "—"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">最近睡眠</p>
            <p className="text-sm font-bold">
              {latestHealth?.sleep_start && latestHealth?.sleep_end
                ? `${calcSleepHours(latestHealth.sleep_start, latestHealth.sleep_end)}h`
                : "—"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">本周运动</p>
            <p className="text-sm font-bold">
              {weekExercises > 0 ? `${weekExercises}次 / ${totalMinutes}分钟` : "—"}
            </p>
          </div>
        </div>

        {/* 体重趋势 */}
        {weights.length > 1 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">体重趋势</p>
            <div className="flex items-end gap-1 h-16">
              {weights.slice(0, 7).reverse().map((w) => {
                const min = Math.min(...weights.map((x) => x.weight));
                const max = Math.max(...weights.map((x) => x.weight));
                const range = max - min || 1;
                const height = ((w.weight - min) / range) * 100;
                return (
                  <div key={w.date} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className="w-full bg-brand-400 rounded-t"
                      style={{ height: `${Math.max(height, 10)}%`, minHeight: 4 }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {format(new Date(w.date), "dd", { locale: zhCN })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 最近记录 */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400">最近记录</p>
          {member.healthLogs.length === 0 && member.exerciseLogs.length === 0 ? (
            <p className="text-sm text-gray-400">暂无记录</p>
          ) : (
            <>
              {member.healthLogs.slice(0, 3).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-500">
                    {format(new Date(h.log_date), "M/d")}
                  </span>
                  <span className="text-gray-700">
                    {[
                      h.weight && `${h.weight}kg`,
                      h.mood && MOOD_LABELS[h.mood],
                      h.period_active && "经期",
                      h.sleep_quality && `睡眠${h.sleep_quality}/5`,
                    ].filter(Boolean).join(" · ") || "已记录"}
                  </span>
                </div>
              ))}
              {member.exerciseLogs.slice(0, 2).map((e) => (
                <div key={e.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-500">
                    {format(new Date(e.log_date), "M/d")}
                  </span>
                  <span className="text-gray-700">
                    🏃 {e.exercise_type} {e.duration_minutes}分钟
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="我们的状态" />

      <div className="page-container space-y-4">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          标记为「仅自己可见」的记录不会显示在这里
        </p>

        {loading ? (
          <p className="text-center text-gray-400 py-8">加载中...</p>
        ) : (
          members.map(renderMember)
        )}
      </div>
    </div>
  );
}
