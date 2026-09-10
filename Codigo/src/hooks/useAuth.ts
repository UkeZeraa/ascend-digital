import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
};

async function checkAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("checkAdmin:", error.message);
    return false;
  }
  return !!data;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ session: null, isAdmin: false, loading: true });

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const admin = await checkAdmin(data.session?.user.id);
      if (active) setState({ session: data.session, isAdmin: admin, loading: false });
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const admin = await checkAdmin(session?.user.id);
      if (active) setState({ session, isAdmin: admin, loading: false });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { ...state, signIn, signOut };
}
