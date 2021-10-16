import { useEffect, useMemo, useState } from "react";
import { Provider, Session } from "@supabase/gotrue-js";
import supabase from "./supabaseClient";

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(supabase.auth.session());
    setLoading(false);
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSession(session);
      } else {
        setSession(null);
      }
    });
    return () => {
      subscription.data?.unsubscribe();
    };
  }, []);

  const signUp = useMemo(() => {
    return async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      await supabase.auth.signUp({ email, password });
      setLoading(false);
    };
  }, []);

  const signIn = useMemo(() => {
    return async ({
      email,
      password,
      provider,
    }: {
      email?: string;
      password?: string;
      provider?: Provider;
    }) => {
      setLoading(true);
      await supabase.auth.signIn({ email, password, provider });
      setLoading(false);
    };
  }, []);

  const signOut = useMemo(() => {
    return async () => {
      setLoading(true);
      await supabase.auth.signOut();
      setLoading(false);
    };
  }, []);

  return { session, loading, signUp, signIn, signOut, supabase };
};
