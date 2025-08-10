'use client';
import React from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import SimpleTitle from '@/components/atoms/SimpleTitle';
import LoginForm from '@/components/organisms/LoginForm';
import { useAuth } from '@/lib/contexts/AuthContext';

import ProtectedRouteProps from './index.types';
/**
 * ProtectedRoute - Componente per proteggere route che richiedono autenticazione
 *
 * Features:
 * - Protezione route authenticated
 * - Controllo ruoli admin
 * - Loading states
 * - Fallback personalizzabili
 *
 * @param children - Componenti da proteggere
 * @param requireAdmin - Se richiede ruolo admin
 * @param fallback - Componente da mostrare se non autorizzato
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Non autenticato
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return <LoginForm />;
  }

  // Autenticato ma non admin (se richiesto)
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <SimpleTitle level="h1">Accesso Negato</SimpleTitle>

          <ErrorMessage
            variant="warning"
            title="Autorizzazione Insufficiente"
            message="Non hai i permessi necessari per accedere a questa sezione."
            details={`Connesso come: ${user?.email}`}
          />

          <div className="text-sm text-muted-foreground">
            Contatta l&apos;amministratore se pensi che sia un errore
          </div>
        </div>
      </div>
    );
  }

  // Tutto ok, mostra contenuto protetto
  return <>{children}</>;
}
