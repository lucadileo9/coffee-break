'use client';

import React from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ProductItem from '@/components/molecules/ProductItem';

import ProductsListProps from './index.types';

/**
 * ProductsList - Componente per visualizzare e filtrare la lista dei prodotti
 *
 * Features:
 * - Lista prodotti con layout responsive
 * - Filtro per categoria (CategoryFilter component)
 * - Ricerca per nome
 * - Loading skeleton
 * - Gestione errori
 * - Click handler per navigazione ai dettagli
 */
export default function ProductsList({
  products,
  loading,
  error,
  onProductClick,
  emptyMessage = 'Nessun prodotto trovato.',
}: ProductsListProps) {

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton per lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <ErrorMessage message={error} variant="error" showIcon={true} />
      </div>
    );
  }

  if (products.length === 0) {
        return (
      <div className="text-center text-muted-foreground">{emptyMessage}</div>
    );
  } 

  return (
    <div className="grid grid-cols-1 gap-4">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}
