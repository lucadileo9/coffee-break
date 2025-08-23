import { useState, useEffect, useCallback } from 'react';

import { Guide } from '@/types/guides';

interface UseGuidesOptions {
  categoryId?: string;
  autoFetch?: boolean;
}

export const useGuides = (options: UseGuidesOptions = {}) => {
  const { categoryId, autoFetch = true } = options;

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (categoryId) {
        params.append('id', categoryId);
      }

      const url = `/api/guides${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Errore nel caricare le guide');
      }

      const result = await response.json();
      setGuides(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (autoFetch) {
      fetchGuides();
    }
  }, [autoFetch, fetchGuides]); // Ricarica quando cambia la categoria

  return {
    guides,
    loading,
    error,
    refetch: fetchGuides,
  };
};
