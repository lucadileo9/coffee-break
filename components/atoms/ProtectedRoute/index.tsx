import React from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import SimpleTitle from '@/components/atoms/SimpleTitle';
import LoginForm from '@/components/organisms/LoginForm';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

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
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
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
