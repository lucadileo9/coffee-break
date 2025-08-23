import React from 'react';

import { Button } from '@/components/ui/button';

import ProductItemProps from './index.types';
/**
 * ProductItem - Componente molecolare per singolo item nella lista prodotti
 *
 * Features:
 * - Visualizzazione info prodotto
 * - Azioni edit/delete
 * - Loading states
 * - Formattazione date localizzata
 */
export default function ProductItem({
  product,
  onEdit,
  onDelete,
  loading,
}: ProductItemProps) {
  function formatPrice(priceInCents: number): string {
    return (priceInCents / 100).toFixed(2);
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex-1">
        <h4 className="font-medium">{product.name}</h4>
        <p className="text-sm text-muted-foreground">
          Categoria: {product.categories?.name || 'N/A'} • Creata:{' '}
          {new Date(product.created_at).toLocaleDateString('it-IT')}
        </p>
        <div className="mt-1 text-xs text-muted-foreground">
          {product.description ?? 'Nessuna descrizione disponibile'}
        </div>
      </div>

      {/* Prezzo */}
      <div className="text-lg font-bold">
        {product.price
          ? `${formatPrice(product.price)} €`
          : 'Prezzo non disponibile'}
      </div>

      <div className="ml-4 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
          disabled={loading}
        >
          Modifica
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={loading}
        >
          Elimina
        </Button>
      </div>
    </div>
  );
}
