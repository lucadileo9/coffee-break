'use client';

import { useParams, useRouter } from 'next/navigation';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import MyButton from '@/components/atoms/MyButton';
import ProtectedRoute from '@/components/atoms/ProtectedRoute';
import ProductCard from '@/components/molecules/ProductCard';
import { useProducts } from '@/lib/hooks/useProducts';
import { useProduct } from '@/lib/hooks/useProduct';

/**
 * Product Detail Page - Pagina per visualizzare i dettagli di un singolo prodotto
 *
 * Features:
 * - Visualizza tutte le informazioni del prodotto
 * - Formattazione prezzo
 * - Categoria associata
 * - Pulsante "Torna alla lista"
 * - Loading states
 * - Gestione errori
 */



export default function ProductPage() {
  // Resolve the params Promise
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Carica tutti i prodotti e trova quello specifico
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen p-8">
          <div className="mx-auto max-w-4xl">
            <MyButton
              icon="arrow-left"
              onClick={() => router.push('/products')}
              className="mb-8 gap-2"
            >
              Torna ai Prodotti
            </MyButton>
            <LoadingSkeleton lines={5} className="mb-8" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen p-8">
          <div className="mx-auto max-w-4xl">
            <MyButton
              icon="arrow-left"
              onClick={() => router.push('/products')}
              className="mb-8 gap-2"
            >
              Torna ai Prodotti
            </MyButton>
            <ErrorMessage
              title={error ?? undefined}
              message="Si è verificato un errore durante il caricamento del prodotto."
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return null;
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <MyButton
            icon="arrow-left"
            onClick={() => router.push('/products')}
            className="mb-8 gap-2"
          >
            Torna ai Prodotti
          </MyButton>

          {/* Product Content */}
          <ProductCard product={product} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
