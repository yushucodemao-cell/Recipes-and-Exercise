"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { withBasePath } from "@/lib/routes";
import type { Profile, Household } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

interface AppContextType {
  user: User | null;
  profile: Profile | null;
  household: Household | null;
  roommates: Profile[];
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  profile: null,
  household: null,
  roommates: [],
  loading: true,
  refresh: async () => {},
  signOut: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [roommates, setRoommates] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const refresh = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);

    if (!u) {
      setProfile(null);
      setHousehold(null);
      setRoommates([]);
      setLoading(false);
      return;
    }

    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", u.id)
      .single();

    setProfile(prof);

    if (prof?.household_id) {
      const { data: hh } = await supabase
        .from("households")
        .select("*")
        .eq("id", prof.household_id)
        .single();
      setHousehold(hh);

      const { data: mates } = await supabase
        .from("profiles")
        .select("*")
        .eq("household_id", prof.household_id);
      setRoommates(mates ?? []);
    } else {
      setHousehold(null);
      setRoommates([]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh, supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = withBasePath("/login");
  };

  return (
    <AppContext.Provider value={{ user, profile, household, roommates, loading, refresh, signOut }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
