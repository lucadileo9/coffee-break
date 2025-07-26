import { useState, useEffect } from 'react';

import { Guide } from '@/types/guides';

export const useGuide = (id: string) => {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/guides/${id}`);
        
        if (!response.ok) {
          throw new Error('Guida non trovata');
        }

        const result = await response.json();
        setGuide(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        console.error('Error fetching guide:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuide();
    }
  }, [id]);

  return { guide, loading, error };
};