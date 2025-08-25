'use client';

import ProtectedRoute from '@/components/atoms/ProtectedRoute';
import ProductsManager from '@/components/organisms/ProductsManager';

/**
 * Admin Products Page - Pagina amministrazione prodotti
 *
 * Features:
 * - Gestione completa prodotti
 * - Solo per amministratori
 * - CRUD operations
 */
export default function AdminProductsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <ProductsManager />
      </div>
    </ProtectedRoute>
  );
}
