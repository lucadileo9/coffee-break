import React from 'react';

import AdminLayout from '@/components/organisms/AdminLayout';
import CategoriesManager from '@/components/organisms/CategoriesManager';

/**
 * AdminCategoriesPage - Pagina dedicata alla gestione delle categorie
 */
export default function AdminCategoriesPage() {
  return (
    // <ProtectedRoute requireAdmin={true}>
    <AdminLayout
      title="Gestione Categorie"
      description="Crea, modifica ed elimina le categorie per organizzare le guide"
    >
      <CategoriesManager />
    </AdminLayout>
    // </ProtectedRoute>
  );
}
