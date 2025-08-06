import React from 'react';

import ProtectedRoute from '@/components/atoms/ProtectedRoute';
import SimpleTitle from '@/components/atoms/SimpleTitle';
import StatsCard from '@/components/atoms/StatsCard';
import AdminLayout from '@/components/organisms/AdminLayout';
import CategoriesManager from '@/components/organisms/CategoriesManager';
import GuidesManager from '@/components/organisms/GuidesManager';

/**
 * AdminDashboardPage - Pagina principale del pannello amministrativo
 * 
 * Features:
 * - Overview statistiche
 * - Gestione guide (CRUD)
 * - Gestione categorie (CRUD)
 * - Layout responsive con tabs
 */
export default function AdminDashboardPage() {
  return (
    // <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header Dashboard */}

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Guide Pubblicate"
              description="Totale guide disponibili"
              endpoint="/api/guides"
            />
            <StatsCard 
              title="Categorie Attive"
              description="Categorie configurate"
              endpoint="/api/categories"
            />
          </div>

          {/* Gestione Contenuti */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            <div className="space-y-4">
              <SimpleTitle level="h2">Gestione Guide</SimpleTitle>
              <GuidesManager />
            </div>

            <div className="space-y-4">
              <SimpleTitle level="h2">Gestione Categorie</SimpleTitle>
              <CategoriesManager />
            </div>
          </div>
        </div>
      </AdminLayout>
  );
}