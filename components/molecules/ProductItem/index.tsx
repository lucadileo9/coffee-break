import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ProductItemProps from './index.types';

/**
 * ProductItem - Componente per visualizzare un singolo prodotto nella lista
 *
 * Features:
 * - Visualizza nome e prezzo (senza descrizione)
 * - Mostra categoria
 * - Click handler per navigazione ai dettagli
 * - Design compatto per liste
 */
export default function ProductItem({ product, onClick }: ProductItemProps) {
  const handleClick = () => {
    onClick(product);
  };

  // Formatta il prezzo da centesimi a euro
  /**
   * Formats a price given in cents into a string with two decimal places.
   * It divides the input number by 100 to convert cents to the main currency unit (e.g., dollars)
   * and then formats it to ensure it always has two decimal places.
   *
   * @param priceInCents The price of the product in cents.
   * @returns A string representing the formatted price (e.g., "9.90").
   * @example
   *  returns "9.90"
   * formatPrice(990)
   *
   * @example
   *  returns "12.00"
   * formatPrice(1200)
   */
  function formatPrice(priceInCents: number): string {
    return (priceInCents / 100).toFixed(2);
  }

  return (
    <Card
      className="cursor-pointer transition-shadow duration-200 hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 text-lg font-semibold">
            {product.name}
          </CardTitle>
          <div className="ml-4 shrink-0 text-lg font-bold text-primary">
            €{formatPrice(product.price)}
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
        {/* Data creazione */}
        <div className="text-xs text-muted-foreground">
          Aggiunto il {new Date(product.created_at).toLocaleDateString('it-IT')}
        </div>
      </CardContent>
    </Card>
  );
}
