"use client";

import { useApp } from "@/components/providers/app-provider";
import { LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AppHeader({ title }: { title: string }) {
  const { household, profile, signOut } = useApp();
  const [copied, setCopied] = useState(false);

  const copyInvite = async () => {
    if (!household?.invite_code) return;
    await navigator.clipboard.writeText(household.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-500 text-white px-4 py-3 safe-top">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <p className="text-xs opacity-80">好吃好练</p>
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {household && (
            <button
              onClick={copyInvite}
              className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1 text-xs"
              title="邀请码"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {household.invite_code}
            </button>
          )}
          <span className="text-xs opacity-80">{profile?.display_name}</span>
          <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-white/20">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
