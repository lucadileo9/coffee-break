import React from 'react';

import AdminDashboard from '@/components/organisms/AdminDashboard';

/**
 * Pagina Dashboard Amministrativa
 *
 * Features:
 * - Panoramica statistiche
 * - Azioni rapide
 * - Layout automatico tramite layout.tsx
 */
export default function AdminPage() {
  return <AdminDashboard />;
}

// Metadata per la pagina
export const metadata = {
  title: 'Dashboard Admin | Coffee Break',
  description: 'Pannello di amministrazione per Coffee Break',
};
