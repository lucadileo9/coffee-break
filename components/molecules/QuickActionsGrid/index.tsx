'use client';

import React from 'react';

import QuickActionCard from '@/components/atoms/QuickActionCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import QuickActionsGridProps from './index.types';

/**
 * QuickActionsGrid - Componente molecola per organizzare azioni rapide
 *
 * Features:
 * - Grid responsive fisso (2 colonne su md, 3 su lg)
 * - Wrapper Card sempre presente
 * - Supporto per titolo e descrizione
 * - Semplicità d'uso
 */
export default function QuickActionsGrid({
  title = 'Azioni Rapide',
  description = 'Accesso diretto alle funzioni più utilizzate',
  actions,
  className = '',
}: QuickActionsGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div
          className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}
        >
          {actions.map((action) => (
            <QuickActionCard key={action.id} {...action.cardProps} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
