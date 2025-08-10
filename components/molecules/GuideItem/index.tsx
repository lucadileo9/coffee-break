import React from 'react';

import { Button } from '@/components/ui/button';

import GuideItemProps from './index.types';
/**
 * GuideItem - Componente molecolare per singolo item nella lista guide
 *
 * Features:
 * - Visualizzazione info guida
 * - Azioni edit/delete
 * - Loading states
 * - Formattazione date localizzata
 */
export default function GuideItem({
  guide,
  onEdit,
  onDelete,
  loading,
}: GuideItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex-1">
        <h4 className="font-medium">{guide.title}</h4>
        <p className="text-sm text-muted-foreground">
          Categoria: {guide.categories?.name || 'N/A'} • Creata:{' '}
          {new Date(guide.created_at).toLocaleDateString('it-IT')}
        </p>
        <div className="mt-1 text-xs text-muted-foreground">
          {guide.content.length > 100
            ? `${guide.content.substring(0, 100)}...`
            : guide.content}
        </div>
      </div>

      <div className="ml-4 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(guide)}
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
