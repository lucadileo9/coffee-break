import React from 'react';

import ProtectedRoute from '@/components/atoms/ProtectedRoute';
import AdminLayout from '@/components/organisms/AdminLayout';
import GuidesManager from '@/components/organisms/GuidesManager';

/**
 * AdminGuidesPage - Pagina dedicata alla gestione delle guide
 */
export default function AdminGuidesPage() {
  return (
    // <ProtectedRoute requireAdmin={true}>
      <AdminLayout 
        title="Gestione Guide"
        description="Crea, modifica ed elimina le guide del Coffee Break"
      >
        <GuidesManager />
      </AdminLayout>
    // </ProtectedRoute>
  );
}
