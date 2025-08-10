import { User } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Interfaccia per il risultato dell'autenticazione
 */
export interface AuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  error?: string;
}

/**
 * Lista delle email admin autorizzate
 * In un'app di produzione, questa lista potrebbe venire da:
 * - Database (tabella admins)
 * - Variabili d'ambiente
 * - Servizio di gestione ruoli
 */
const ADMIN_EMAILS = ['lucadileo70@gmail.com', 'marco.krt@libero.it', 'agrimiky@gmail.com'];

/**
 * Verifica se un'email appartiene a un amministratore
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Estrae e verifica l'autenticazione dal token Bearer
 *
 * Meccanismo:
 * 1. Estrae il token dall'header Authorization
 * 2. Usa Supabase per verificare il token
 * 3. Controlla se l'utente è admin
 *
 * @param request - Request HTTP con header Authorization
 * @returns Promise<AuthResult> - Risultato dell'autenticazione
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // 1. Estrae il token Bearer dall'header Authorization
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: 'Token di autenticazione mancante',
      };
    }

    // Estrae il token (rimuove "Bearer ")
    const BEARER_PREFIX_LENGTH = 7; // "Bearer ".length
    const token = authHeader.substring(BEARER_PREFIX_LENGTH);

    // 2. Verifica il token con Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: 'Token non valido o scaduto',
      };
    }

    // 3. Verifica se l'utente è admin
    const userIsAdmin = isAdminEmail(user.email || '');

    return {
      isAuthenticated: true,
      isAdmin: userIsAdmin,
      user,
      error: undefined,
    };
  } catch (error) {
    console.error('Errore durante verifica autenticazione:', error);
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: 'Errore interno durante autenticazione',
    };
  }
}

/**
 * Middleware di autenticazione per API routes
 *
 * @param request - Request HTTP
 * @param requireAdmin - Se true, richiede permessi admin
 * @returns AuthResult o null se tutto ok
 */
export async function requireAuth(
  request: NextRequest,
  requireAdmin: boolean = false
): Promise<AuthResult | null> {
  const auth = await verifyAuth(request);

  // Se non autenticato
  if (!auth.isAuthenticated) {
    return auth;
  }

  // Se richiede admin ma l'utente non è admin
  if (requireAdmin && !auth.isAdmin) {
    return {
      isAuthenticated: true,
      isAdmin: false,
      user: auth.user,
      error: 'Permessi amministratore richiesti',
    };
  }

  // Tutto ok, non restituire errore
  return null;
}
