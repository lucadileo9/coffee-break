import React from 'react';

import SimpleTitle from '@/components/atoms/SimpleTitle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Pagina Impostazioni Admin
 *
 * Features future:
 * - Configurazioni sistema
 * - Gestione utenti admin
 * - Backup/Export dati
 * - Impostazioni sicurezza
 */
export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header pagina */}
      <div>
        <SimpleTitle level="h1" className="mb-2">
          Impostazioni Sistema
        </SimpleTitle>
        <p className="text-muted-foreground">
          Configura le impostazioni avanzate del sistema Coffee Break
        </p>
      </div>

      {/* Placeholder content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gestione Utenti</CardTitle>
            <CardDescription>
              Aggiungi o rimuovi amministratori del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funzionalità in sviluppo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup & Export</CardTitle>
            <CardDescription>
              Esporta dati e crea backup del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funzionalità in sviluppo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurazioni Email</CardTitle>
            <CardDescription>
              Configura notifiche e email automatiche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funzionalità in sviluppo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sicurezza</CardTitle>
            <CardDescription>
              Gestisci le impostazioni di sicurezza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funzionalità in sviluppo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Metadata per la pagina
export const metadata = {
  title: 'Impostazioni | Coffee Break Admin',
  description: 'Configura le impostazioni del sistema',
};
