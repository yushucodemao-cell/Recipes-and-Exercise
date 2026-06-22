"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/app-provider";

export default function HomePage() {
  const { user, profile, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!profile?.household_id) {
      router.replace("/setup");
    } else {
      router.replace("/plan");
    }
  }, [user, profile, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-2xl font-bold text-brand-500 mb-2">好吃好练</p>
        <p className="text-gray-400 text-sm">加载中...</p>
      </div>
    </div>
  );
}
