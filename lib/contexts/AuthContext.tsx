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

  // Metodo per gestire token scaduti
  handleTokenExpired: () => void;

  // Utility
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function per verificare se un'email è admin
const isAdminEmail = (email: string): boolean => {
  const adminEmails = ['lucadileo70@gmail.com', 'marco.krt@libero.it'];
  return adminEmails.includes(email);
};

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

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // ✅ Login riuscito - Determina redirect in base al ruolo
        const isUserAdmin = isAdminEmail(email);

        const redirectPath = isUserAdmin ? '/admin/' : '/';

        console.warn(
          `🔐 Login riuscito per ${email}, redirect a: ${redirectPath}`
        );
        router.push(redirectPath);
      } else {
        // ❌ Errore di login - rimane sul form
        console.error(`❌ Login fallito per ${email}:`, error.message);
      }

      setLoading(false);
      return { error };
    } catch (err) {
      // ❌ Errore imprevisto
      console.error('Errore imprevisto durante il login:', err);
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  // Metodo per logout
  const signOut = async () => {
    setLoading(true);

    try {
      // Tenta il logout normale
      const { error } = await supabase.auth.signOut();

      if (!error) {
        console.warn('🚪 Logout riuscito, redirect alla home');
      } else {
        console.warn(
          '⚠️ Errore durante logout, ma procediamo con clear locale:',
          error.message
        );
      }
    } catch (err) {
      console.warn(
        '⚠️ Errore durante logout, ma procediamo con clear locale:',
        err
      );
    }

    // SEMPRE pulisci lo stato locale, anche se il logout server fallisce
    setUser(null);
    setSession(null);

    // Clear anche il local storage per sicurezza
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (err) {
      console.warn('Errore durante clear storage:', err);
    }

    // Redirect alla home sempre (per sicurezza)
    router.push('/');
    setLoading(false);

    // Ritorna sempre successo per evitare blocchi UI
    return { error: null };
  };

  // Metodo per gestire token scaduti
  const handleTokenExpired = () => {
    console.warn('🔄 Token scaduto rilevato, effettuo logout automatico');

    // Clear dello stato locale immediatamente
    setUser(null);
    setSession(null);

    // Clear storage
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (err) {
      console.warn('Errore durante clear storage:', err);
    }

    // Redirect al login
    router.push('/login');
  };

  // Computed values
  const isAuthenticated = !!user;
  const isAdmin = !!user && isAdminEmail(user.email || '');
  // || user.user_metadata?.role === 'admin' ||
  // user.app_metadata?.role === 'admin'

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    handleTokenExpired,
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
