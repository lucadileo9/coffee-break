'use client';
import React from 'react';

import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import SimpleTitle from '@/components/atoms/SimpleTitle';
import AdminHeader from '@/components/molecules/AdminHeader';
import { useAuth } from '@/lib/contexts/AuthContext';

import AdminLayoutProps from './index.types';

/**
 * AdminLayout - Layout per pagine di amministrazione
 *
 * Features:
 * - AdminHeader separato con info utente e logout
 * - Navigazione admin con highlight pagina corrente
 * - Layout responsive senza footer
 * - Breadcrumb e titoli
 * - LoadingSkeleton per stati loading
 */
export default function AdminLayout({
  children,
  title = 'Pannello Amministrativo',
  description,
  currentPage = 'dashboard',
}: AdminLayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSkeleton variant="default" className="w-96" lines={4} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      {/* Header Admin con navigazione integrata */}
      <AdminHeader currentPage={currentPage} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        {title && (
          <div className="mb-8">
            <SimpleTitle level="h1" className="mb-2">
              {title}
            </SimpleTitle>
            {description && (
              <p className="max-w-3xl text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {/* Page Content */}
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}
