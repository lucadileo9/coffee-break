import { useState } from 'react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { HTTP_STATUS } from '@/lib/http-status';
import { Category } from '@/types/category';

/**
 * Interfaccia per i dati di creazione/aggiornamento categoria
 */
interface CategoryData {
  name: string;
}

/**
 * Hook per gestire le operazioni CRUD delle categorie
 * Fornisce metodi per creare, aggiornare ed eliminare categorie
 */
export function useCategoriesAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session, handleTokenExpired } = useAuth();

  /**
   * Funzione helper per ottenere gli headers con autenticazione
   */
  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  };

  /**
   * Gestisce errori di autenticazione
   */
  const handleAuthError = (error: string, response?: Response) => {
    if (
      response?.status === HTTP_STATUS.UNAUTHORIZED || 
      error.includes('Token non valido') || 
      error.includes('Token di autenticazione mancante') ||
      error.includes('scaduto')
    ) {
      console.warn('Token scaduto rilevato, effettuo logout automatico');
      handleTokenExpired();
      return true; // Indica che è stato gestito un errore di auth
    }
    return false; // Non è un errore di auth
  };

  /**
   * Crea una nuova categoria
   */
  const createCategory = async (
    categoryData: CategoryData
  ): Promise<Category | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || 'Errore durante la creazione';
        
        // Controlla se è un errore di autenticazione
        if (handleAuthError(errorMessage, response)) {
          return null; // L'utente verrà reindirizzato al login
        }
        
        throw new Error(errorMessage);
      }

      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aggiorna una categoria esistente
   */
  const updateCategory = async (
    id: string,
    categoryData: CategoryData
  ): Promise<Category | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || "Errore durante l'aggiornamento";
        
        // Controlla se è un errore di autenticazione
        if (handleAuthError(errorMessage, response)) {
          return null; // L'utente verrà reindirizzato al login
        }
        
        throw new Error(errorMessage);
      }

      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina una categoria
   * ATTENZIONE: Fallisce se ci sono guide associate
   */
  const deleteCategory = async (
    id: string
  ): Promise<{ success: boolean; guidesCount?: number }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        // Controlla se è un errore di autenticazione prima di altri controlli
        const errorMessage = result.error || "Errore durante l'eliminazione";
        if (handleAuthError(errorMessage, response)) {
          return { success: false }; // L'utente verrà reindirizzato al login
        }
        
        // Se errore 409 (conflict), include il conteggio guide
        if (response.status === HTTP_STATUS.CONFLICT) {
          setError(result.error);
          return {
            success: false,
            guidesCount: result.guides_count,
          };
        }

        throw new Error(errorMessage);
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recupera una singola categoria con conteggio guide
   */
  const getCategory = async (
    id: string
  ): Promise<(Category & { guides_count: number }) | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante il recupero');
      }

      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // States
    loading,
    error,

    // Methods
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,

    // Utility
    clearError: () => setError(null),
  };
}
