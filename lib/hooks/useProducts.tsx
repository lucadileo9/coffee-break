import { useCallback, useEffect, useState } from 'react';

import { ProductWithCategory } from '@/types/products';

interface UseProductsOptions {
  categoryId?: string;
  autoFetch?: boolean;
}

/**
 * Hook per recuperare prodotti dal database
 * Fornisce stato e metodi per caricare prodotti con auto-fetch
 */
export function useProducts(options: UseProductsOptions = {}) {
  const { categoryId, autoFetch = true } = options;

  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  /**
   * Recupera prodotti dal server
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (categoryId) {
        params.append('id', categoryId);
      }

      const url = `/api/products${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Errore nel caricare le guide');
      }
      const result = await response.json();

      setProducts(result.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      console.error('Errore fetch prodotti:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  /**
   * Auto-fetch al mount e quando cambia categoryId
   */
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  return {
    // Data
    products,
    loading,
    error,

    // Methods
    refetch: fetchProducts,
  };
}
