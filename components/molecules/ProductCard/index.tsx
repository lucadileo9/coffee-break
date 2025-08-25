import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ProductCardProps from './index.types';

/**
 * ProductCard - Card per visualizzare un prodotto
 *
 * Features:
 * - Visualizza nome, descrizione, prezzo
 * - Mostra categoria (opzionale)
 * - Formattazione prezzo in euro
 * - Click handler per navigazione
 * - Responsive design
 */
export default function ProductCard({ product, onClick }: ProductCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  // Formatta il prezzo da centesimi a euro
  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toFixed(2);
  };

  return (
    <Card
      className="transition-shadow duration-200 hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 text-lg font-semibold">
            {product.name}
          </CardTitle>
          <div className="ml-4 shrink-0 text-xl font-bold text-primary">
            {formatPrice(product.price)} €
          </div>
        </div>

        {/* Categoria */}
        {product.categories && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {product.categories.name}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Descrizione */}
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Data creazione */}
        <div className="mt-4 text-xs text-muted-foreground">
          Creato il {new Date(product.created_at).toLocaleDateString('it-IT')}
        </div>
      </CardContent>
    </Card>
  );
}
