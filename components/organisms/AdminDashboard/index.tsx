'use client';

import React from 'react';

import SimpleTitle from '@/components/atoms/SimpleTitle';
import StatsCard from '@/components/atoms/StatsCard';
import QuickActionsGrid from '@/components/molecules/QuickActionsGrid';
import { ACTION_PRESETS } from '@/lib/quick-actions-config';

/**
 * AdminDashboard - Dashboard principale dell'admin
 *
 * Features:
 * - Statistiche generali del sistema
 * - Azioni rapide per navigazione
 * - Sezione attività recenti (placeholder)
 * - Design responsive
 */
export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <SimpleTitle level="h1" className="mb-2">
          Dashboard Amministrativa
        </SimpleTitle>
        <p className="text-muted-foreground">
          Benvenuto nel pannello di controllo di Coffee Break
        </p>
      </div>

      {/* Statistiche Rapide */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Totale Guide"
          description="Guide pubblicate"
          endpoint="/api/guides"
        />

        <StatsCard
          title="Totale Categorie"
          description="Categorie attive"
          endpoint="/api/categories"
        />

        <StatsCard
          title="Totale Prodotti"
          description="Prodotti pubblicati"
          endpoint="/api/products"
        />
      </div>

      {/* Azioni Rapide */}
      <QuickActionsGrid
        actions={[...ACTION_PRESETS.ADMIN_DASHBOARD]}
        title="Azioni Rapide"
        description="Accesso diretto alle funzioni più utilizzate"
      />
    </div>
  );
}
