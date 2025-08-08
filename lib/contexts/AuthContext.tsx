'use client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

interface AuthContextType {
  // Stato autenticazione
  user: User | null;
  session: Session | null;
  loading: boolean;

  // Metodi autenticazione
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;

  // Utility
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Provider per gestire stato globale autenticazione
 *
 * Features:
 * - Gestione sessione automatica
 * - Persistenza login tra refresh
 * - Controllo ruoli admin
 * - Loading states
 *
 * @param children - Componenti figli
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // Utente corrente
  const [session, setSession] = useState<Session | null>(null); // Sessione corrente
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const router = useRouter();

  // Inizializza sessione al mount
  useEffect(() => {
    // Ottieni sessione corrente
    /**
     * Retrieves the current authentication session from Supabase and updates the local session and user state.
     *
     * - Calls `supabase.auth.getSession()` to fetch the current session.
     * - If an error occurs, logs the error to the console.
     * - On success, updates the session and user state with the retrieved session data.
     * - Sets the loading state to `false` after the operation completes.
     *
     * @async
     * @returns {Promise<void>} A promise that resolves when the session retrieval and state updates are complete.
     */
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }

      setLoading(false);
    };

    getSession(); // Inizializza sessione al mount

    // Listener per cambi di stato auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Metodo per login
  const signIn = async (email: string, password: string) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const isUserAdmin = 
    (email === 'lucadileo70@gmail.com' ||
      email === 'marco.krt@libero.it');
    if (isUserAdmin) {
      router.push('/admin/dashboard'); // Admin → Dashboard
    } else {
      router.push('/calculator'); // Utenti normali → Homepage
    }

    setLoading(false);
    return { error };
  };

  // Metodo per logout
  const signOut = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(null);
      setSession(null);
    }

    setLoading(false);
    return { error };
  };

  // Computed values
  const isAuthenticated = !!user;
  const isAdmin =
    !!user &&
    (user.email === 'lucadileo70@gmail.com' ||
      user.email === 'marco.krt@libero.it' 
      // || user.user_metadata?.role === 'admin' || 
      // user.app_metadata?.role === 'admin'
    );

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook per utilizzare il context di autenticazione
 * @returns AuthContextType
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
