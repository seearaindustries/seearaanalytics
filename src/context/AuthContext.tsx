import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Role, UserProfile } from '../types';

// ─── Context Shape ─────────────────────────────────────────────────────────────
interface AuthContextValue {
  /** Null while loading or logged out */
  user: UserProfile | null;
  /** True only during initial hydration */
  loading: boolean;
  /** Signs user in with email + password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Signs the current user out */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Fetches the role for a given user id from the `user_roles` table.
 * Falls back to 'operator' if the row is missing (safe default).
 */
async function fetchRole(userId: string): Promise<Role> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.warn('[AuthContext] Could not fetch role, defaulting to operator:', error?.message);
    return 'operator';
  }

  return data.role as Role;
}

/** Maps a raw Supabase User + role into our UserProfile shape */
function buildProfile(user: User, role: Role): UserProfile {
  return {
    id: user.id,
    email: user.email ?? '',
    role,
  };
}

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Called whenever the Supabase session changes (login, logout, token refresh).
   * We keep this as a stable callback so the effect doesn't re-run.
   */
  const handleSessionChange = useCallback(
    async (_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const role = await fetchRole(session.user.id);
        setUser(buildProfile(session.user, role));
      } else {
        setUser(null);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    // 1. Bootstrap: hydrate from the persisted session (works offline too)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const role = await fetchRole(session.user.id);
        setUser(buildProfile(session.user, role));
      }
      setLoading(false);
    });

    // 2. Subscribe to future auth state changes for this tab/window
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleSessionChange);

    return () => subscription.unsubscribe();
  }, [handleSessionChange]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // onAuthStateChange will fire and update state automatically
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // onAuthStateChange fires → setUser(null)
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
}
