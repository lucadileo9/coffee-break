import { useState } from 'react';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante la creazione');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Errore durante l'aggiornamento");
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
      });

      const result = await response.json();

      if (!response.ok) {
        // Se errore 409 (conflict), include il conteggio guide
        if (response.status === 409) {
          setError(result.error);
          return {
            success: false,
            guidesCount: result.guides_count,
          };
        }

        throw new Error(result.error || "Errore durante l'eliminazione");
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
