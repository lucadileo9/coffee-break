'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import SimpleTitle from '@/components/atoms/SimpleTitle';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import ProductsList from '@/components/organisms/ProductsList';
import { useCategories } from '@/lib/hooks/useCategories';
import { useProducts } from '@/lib/hooks/useProducts';

export default function ProductsPage() {
  /**
   * Stato per tracciare la categoria selezionata nel filtro
   * Stringa vuota significa "tutte le categorie"
   */
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  /**
   * Router per la navigazione programmatica verso le pagine di dettaglio
   */
  const router = useRouter();

  // ==================== DATA FETCHING ====================

  /**
   * Hook personalizzato per il caricamento dei prodotti
   * - Se selectedCategory è vuoto, carica tutti i prodotti
   * - Se selectedCategory è valorizzato, filtra per quella categoria
   */
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts({
    categoryId: selectedCategory || undefined,
  });

  /**
   * Hook personalizzato per il caricamento delle categorie
   * Necessario per popolare il filtro delle categorie
   */
  const { categories, loading: categoriesLoading } = useCategories();

  const emptyMessage = selectedCategory
    ? 'Nessun prodotto trovato per questa categoria'
    : 'Nessun prodotto disponibile';

  // ==================== ERROR HANDLING ====================

  /**
   * Gestione degli errori nel caricamento dei prodotti
   * Mostra un messaggio di errore styled con Tailwind
   */
  if (productsError) {
    return (
      // <ProtectedRoute>
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <ErrorMessage
            message={productsError}
            variant="error"
            showIcon={true}
          />
        </div>
      </div>
      // </ProtectedRoute>
    );
  }

  return (
    // <ProtectedRoute>
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        {/* Titolo principale della pagina */}
        <SimpleTitle level="h1" className="mb-8">
          Prodotti
        </SimpleTitle>

        {/* Sezione filtro categorie */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            loading={categoriesLoading}
          />
        </div>

        {/* Lista delle guide filtrate */}
        <ProductsList
          products={products}
          loading={productsLoading}
          error={productsError}
          onProductClick={(id) => router.push(`/products/${id}`)}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
    // </ProtectedRoute>
  );
}
