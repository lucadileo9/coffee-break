'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

import CategoryItemProps from './index.types';

/**
 * CategoryItem - Componente molecolare per singolo item nella lista categorie
 * 
 * Features:
 * - Visualizzazione info categoria
 * - Azioni edit/delete
 * - Loading states
 * - Formattazione date localizzata
 */
export default function CategoryItem({ category, onEdit, onDelete, loading }: CategoryItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium">{category.name}</h4>
        <p className="text-sm text-muted-foreground">
          Creata: {new Date(category.created_at).toLocaleDateString('it-IT')}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(category)}
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
