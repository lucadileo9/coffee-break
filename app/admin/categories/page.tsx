import React from 'react';

import SimpleTitle from '@/components/atoms/SimpleTitle';
import CategoriesManager from '@/components/organisms/CategoriesManager';

/**
 * Pagina gestione categorie
 *
 * Features:
 * - CRUD completo per le categorie
 * - Lista categorie esistenti
 * - Form per creazione/modifica
 * - Layout automatico tramite layout.tsx padre
 */
export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header pagina */}
      <div>
        <SimpleTitle level="h1" className="mb-2">
          Gestione Categorie
        </SimpleTitle>
        <p className="text-muted-foreground">
          Crea, modifica ed elimina le categorie per organizzare le guide
        </p>
      </div>

      {/* Contenuto principale */}
      <CategoriesManager />
    </div>
  );
}

// Metadata per la pagina
export const metadata = {
  title: 'Gestione Categorie | Coffee Break Admin',
  description: 'Gestisci le categorie del Coffee Break',
};
