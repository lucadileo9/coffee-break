import { useState, useEffect } from 'react';

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

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (categoryId) {
        params.append('category_id', categoryId);
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
  };

  useEffect(() => {
    if (autoFetch) {
      fetchGuides();
    }
  }, [categoryId]); // Ricarica quando cambia la categoria

  return {
    guides,
    loading,
    error,
    refetch: fetchGuides,
  };
};