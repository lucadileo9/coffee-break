import { useState } from 'react';

import { CreateGuideData, Guide } from '@/types/guides';

/**
 * Hook per gestire le operazioni CRUD delle guide
 * Fornisce metodi per creare, aggiornare ed eliminare guide
 */
export function useGuidesAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crea una nuova guida
   */
  const createGuide = async (guideData: CreateGuideData): Promise<Guide | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guideData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante la creazione');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aggiorna completamente una guida esistente
   */
  const updateGuide = async (id: string, guideData: CreateGuideData): Promise<Guide | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/guides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guideData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante l\'aggiornamento');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aggiorna parzialmente una guida esistente
   */
  const patchGuide = async (id: string, guideData: Partial<CreateGuideData>): Promise<Guide | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/guides/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guideData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante l\'aggiornamento');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina una guida
   */
  const deleteGuide = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/guides/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante l\'eliminazione');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // States
    loading,
    error,
    
    // Methods
    createGuide,
    updateGuide,
    patchGuide,
    deleteGuide,
    
    // Utility
    clearError: () => setError(null),
  };
}
