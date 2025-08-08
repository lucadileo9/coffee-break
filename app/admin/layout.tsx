import React from 'react';

import ProtectedRoute from '@/components/atoms/ProtectedRoute';
import AdminSidebar from '@/components/organisms/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principale per tutte le pagine admin
 *
 * Features:
 * - ProtectedRoute automatico per tutte le sottopagine
 * - Sidebar di navigazione persistente
 * - Layout responsive
 * - App Router integration
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <main className="flex-1 lg:pl-64">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
