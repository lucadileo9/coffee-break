import React from 'react';

import SimpleTitle from '@/components/atoms/SimpleTitle';
import GuidesManager from '@/components/organisms/GuidesManager';

/**
 * Pagina gestione guide
 *
 * Features:
 * - CRUD completo per le guide
 * - Lista guide esistenti
 * - Form per creazione/modifica
 * - Layout automatico tramite layout.tsx padre
 */
export default function AdminGuidesPage() {
  return (
    <div className="space-y-6">
      {/* Header pagina */}
      <div>
        <SimpleTitle level="h1" className="mb-2">
          Gestione Guide
        </SimpleTitle>
        <p className="text-muted-foreground">
          Crea, modifica ed elimina le guide del Coffee Break
        </p>
      </div>

      {/* Contenuto principale */}
      <GuidesManager />
    </div>
  );
}

// Metadata per la pagina
export const metadata = {
  title: 'Gestione Guide | Coffee Break Admin',
  description: 'Gestisci le guide del Coffee Break',
};
