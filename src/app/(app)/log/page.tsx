"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/providers/app-provider";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { PrivacyToggle } from "@/components/privacy-toggle";
import { todayStr, calcSleepHours } from "@/lib/utils";
import { MOOD_LABELS, EXERCISE_TYPES } from "@/lib/types";
import { format, subDays } from "date-fns";

export default function LogPage() {
  const { profile, household } = useApp();
  const [logDate, setLogDate] = useState(todayStr());
  const [weight, setWeight] = useState("");
  const [mood, setMood] = useState<number | "">("");
  const [moodNote, setMoodNote] = useState("");
  const [periodActive, setPeriodActive] = useState(false);
  const [periodSymptoms, setPeriodSymptoms] = useState("");
  const [sleepStart, setSleepStart] = useState("");
  const [sleepEnd, setSleepEnd] = useState("");
  const [sleepQuality, setSleepQuality] = useState<number | "">("");
  const [healthPrivate, setHealthPrivate] = useState(false);

  const [exerciseType, setExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState("30");
  const [exerciseNotes, setExerciseNotes] = useState("");
  const [exercisePrivate, setExercisePrivate] = useState(false);
  const [hasExercise, setHasExercise] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!profile) return;
    loadLog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logDate, profile]);

  const loadLog = async () => {
    if (!profile) return;

    const { data: health } = await supabase
      .from("health_logs")
      .select("*")
      .eq("user_id", profile.id)
      .eq("log_date", logDate)
      .maybeSingle();

    if (health) {
      setWeight(health.weight?.toString() ?? "");
      setMood(health.mood ?? "");
      setMoodNote(health.mood_note ?? "");
      setPeriodActive(health.period_active ?? false);
      setPeriodSymptoms(health.period_symptoms ?? "");
      setSleepStart(health.sleep_start?.slice(0, 5) ?? "");
      setSleepEnd(health.sleep_end?.slice(0, 5) ?? "");
      setSleepQuality(health.sleep_quality ?? "");
      setHealthPrivate(health.is_private);
    } else {
      setWeight("");
      setMood("");
      setMoodNote("");
      setPeriodActive(false);
      setPeriodSymptoms("");
      setSleepStart("");
      setSleepEnd("");
      setSleepQuality("");
      setHealthPrivate(false);
    }

    const { data: exercises } = await supabase
      .from("exercise_logs")
      .select("*")
      .eq("user_id", profile.id)
      .eq("log_date", logDate);

    if (exercises && exercises.length > 0) {
      const ex = exercises[0];
      setHasExercise(true);
      setExerciseType(ex.exercise_type);
      setExerciseDuration(ex.duration_minutes.toString());
      setExerciseNotes(ex.notes ?? "");
      setExercisePrivate(ex.is_private);
    } else {
      setHasExercise(false);
      setExerciseType("");
      setExerciseDuration("30");
      setExerciseNotes("");
      setExercisePrivate(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !household) return;
    setSaving(true);

    const healthData = {
      user_id: profile.id,
      household_id: household.id,
      log_date: logDate,
      weight: weight ? parseFloat(weight) : null,
      mood: mood || null,
      mood_note: moodNote || null,
      period_active: periodActive,
      period_symptoms: periodSymptoms || null,
      sleep_start: sleepStart || null,
      sleep_end: sleepEnd || null,
      sleep_quality: sleepQuality || null,
      is_private: healthPrivate,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("health_logs").upsert(healthData, { onConflict: "user_id,log_date" });

    await supabase.from("exercise_logs").delete().eq("user_id", profile.id).eq("log_date", logDate);

    if (hasExercise && exerciseType) {
      await supabase.from("exercise_logs").insert({
        user_id: profile.id,
        household_id: household.id,
        log_date: logDate,
        exercise_type: exerciseType,
        duration_minutes: parseInt(exerciseDuration) || 30,
        notes: exerciseNotes || null,
        is_private: exercisePrivate,
      });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sleepHours = calcSleepHours(sleepStart || null, sleepEnd || null);

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), i);
    return { value: format(d, "yyyy-MM-dd"), label: i === 0 ? "今天" : format(d, "M月d日 EEE") };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="每日记录" />

      <div className="page-container space-y-4">
        <Select value={logDate} onChange={(e) => setLogDate(e.target.value)}>
          {dateOptions.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </Select>

        {/* 健康 */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <CardTitle>健康状况</CardTitle>
            <PrivacyToggle isPrivate={healthPrivate} onChange={setHealthPrivate} />
          </div>

          <div className="space-y-3">
            <div>
              <Label>体重 (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="如 55.5"
              />
            </div>

            <div>
              <Label>情绪</Label>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setMood(v)}
                    className={`flex-1 py-2 rounded-xl text-xs border transition-colors ${
                      mood === v ? "bg-brand-500 text-white border-brand-500" : "border-gray-200"
                    }`}
                  >
                    {MOOD_LABELS[v]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>情绪备注</Label>
              <Textarea
                rows={2}
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="今天发生了什么？"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={periodActive}
                  onChange={(e) => setPeriodActive(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-500"
                />
                <span className="text-sm">今天在经期</span>
              </label>
              {periodActive && (
                <Input
                  className="mt-2"
                  value={periodSymptoms}
                  onChange={(e) => setPeriodSymptoms(e.target.value)}
                  placeholder="症状：腹痛、疲劳..."
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>入睡时间</Label>
                <Input type="time" value={sleepStart} onChange={(e) => setSleepStart(e.target.value)} />
              </div>
              <div>
                <Label>起床时间</Label>
                <Input type="time" value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)} />
              </div>
            </div>
            {sleepHours && (
              <p className="text-xs text-gray-400">睡眠时长约 {sleepHours} 小时</p>
            )}

            <div>
              <Label>睡眠质量</Label>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSleepQuality(v)}
                    className={`flex-1 py-2 rounded-xl text-xs border transition-colors ${
                      sleepQuality === v ? "bg-brand-500 text-white border-brand-500" : "border-gray-200"
                    }`}
                  >
                    {v === 1 ? "很差" : v === 5 ? "很好" : v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 运动 */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <CardTitle>运动状况</CardTitle>
            <PrivacyToggle isPrivate={exercisePrivate} onChange={setExercisePrivate} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={hasExercise}
              onChange={(e) => setHasExercise(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-500"
            />
            <span className="text-sm">今天有运动</span>
          </label>

          {hasExercise && (
            <div className="space-y-3">
              <div>
                <Label>运动类型</Label>
                <Select value={exerciseType} onChange={(e) => setExerciseType(e.target.value)}>
                  <option value="">选择类型</option>
                  {EXERCISE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>时长 (分钟)</Label>
                <Input
                  type="number"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(e.target.value)}
                />
              </div>
              <div>
                <Label>备注</Label>
                <Input
                  value={exerciseNotes}
                  onChange={(e) => setExerciseNotes(e.target.value)}
                  placeholder="今天练了什么"
                />
              </div>
            </div>
          )}
        </Card>

        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : saved ? "✓ 已保存" : "保存记录"}
        </Button>
      </div>
    </div>
  );
}
