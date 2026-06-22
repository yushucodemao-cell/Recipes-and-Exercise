"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { generateInviteCode } from "@/lib/utils";
import { seedHouseholdData } from "@/lib/meal-plan";
import { Home, Users } from "lucide-react";

type Household = {
  id: string;
};

export default function SetupPage() {
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [inviteCode, setInviteCode] = useState("");
  const [householdName, setHouseholdName] = useState("我们的家");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, refresh } = useApp();
  const router = useRouter();
  const supabase = createClient();

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    const code = generateInviteCode();
    const { data: household, error: hhError } = await supabase
      .rpc("create_household_for_current_user", {
        household_name: householdName,
        code,
      })
      .single<Household>();

    if (hhError || !household) {
      setError(hhError?.message ?? "创建失败");
      setLoading(false);
      return;
    }

    await seedHouseholdData(supabase, household.id);
    await refresh();
    router.push("/plan");
  };

  const handleJoin = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    const { data: households, error: findError } = await supabase
      .rpc("get_household_by_invite", { code: inviteCode });
    const household = households?.[0];

    if (findError || !household) {
      setError("邀请码无效，请检查后重试");
      setLoading(false);
      return;
    }

    const { error: profError } = await supabase
      .from("profiles")
      .update({ household_id: household.id })
      .eq("id", user.id);

    if (profError) {
      setError(profError.message);
      setLoading(false);
      return;
    }

    await refresh();
    router.push("/plan");
  };

  if (mode === "choose") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-brand-50 to-white">
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-brand-600">设置室友空间</h1>
            <p className="text-gray-500 mt-2 text-sm">创建新空间或加入室友的空间</p>
          </div>

          <Card
            className="cursor-pointer hover:border-brand-300 transition-colors"
            onClick={() => setMode("create")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <Home className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="font-semibold">创建新空间</p>
                <p className="text-sm text-gray-500">我是第一个，邀请室友加入</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:border-brand-300 transition-colors"
            onClick={() => setMode("join")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="font-semibold">加入室友空间</p>
                <p className="text-sm text-gray-500">输入室友分享的邀请码</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-brand-50 to-white">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-brand-600">
            {mode === "create" ? "创建空间" : "加入空间"}
          </h1>
        </div>

        {mode === "create" ? (
          <div>
            <Label>空间名称</Label>
            <Input
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="我们的家"
            />
          </div>
        ) : (
          <div>
            <Label>邀请码</Label>
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="6 位邀请码"
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="w-full"
          onClick={mode === "create" ? handleCreate : handleJoin}
          disabled={loading || (mode === "join" && inviteCode.length < 6)}
        >
          {loading ? "处理中..." : mode === "create" ? "创建并开始" : "加入"}
        </Button>

        <Button variant="ghost" className="w-full" onClick={() => setMode("choose")}>
          返回
        </Button>
      </div>
    </div>
  );
}
