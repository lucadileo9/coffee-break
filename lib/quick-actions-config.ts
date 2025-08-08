import { QuickActionConfig } from '@/components/atoms/QuickActionCard/index.types';

/**
 * Configurazioni predefinite per le azioni rapide più comuni
 *
 * Questo file centralizza tutte le configurazioni delle azioni rapide,
 * rendendo facile aggiungere, modificare o rimuovere azioni in futuro.
 */

export const QUICK_ACTIONS: Record<string, QuickActionConfig> = {
  // === GESTIONE CONTENUTI ===
  CREATE_GUIDE: {
    id: 'create-guide',
    category: 'content',
    requiresAdmin: true,
    cardProps: {
      title: 'Nuova Guida',
      description: 'Crea una nuova guida',
      href: '/admin/guides',
      icon: 'plus',
    },
  },

  MANAGE_GUIDES: {
    id: 'manage-guides',
    category: 'management',
    requiresAdmin: true,
    cardProps: {
      title: 'Gestisci Guide',
      description: 'Visualizza e modifica guide',
      href: '/admin/guides',
      icon: 'book',
    },
  },

  CREATE_CATEGORY: {
    id: 'create-category',
    category: 'content',
    requiresAdmin: true,
    cardProps: {
      title: 'Nuova Categoria',
      description: 'Crea una nuova categoria',
      href: '/admin/categories',
      icon: 'plus',
    },
  },

  MANAGE_CATEGORIES: {
    id: 'manage-categories',
    category: 'management',
    requiresAdmin: true,
    cardProps: {
      title: 'Gestisci Categorie',
      description: 'Organizza le categorie',
      href: '/admin/categories',
      icon: 'file-text',
    },
  },

  // === VISUALIZZAZIONE ===
  VIEW_SITE: {
    id: 'view-site',
    category: 'external',
    requiresAdmin: false,
    cardProps: {
      title: 'Vedi Sito',
      description: 'Visualizza frontend',
      href: '/guides',
      icon: 'globe',
    },
  },

  VIEW_ANALYTICS: {
    id: 'view-analytics',
    category: 'system',
    requiresAdmin: true,
    cardProps: {
      title: 'Statistiche',
      description: 'Analisi e metriche',
      href: '/admin/analytics',
      icon: 'trending-up',
    },
  },

  // === SISTEMA ===
  MANAGE_USERS: {
    id: 'manage-users',
    category: 'system',
    requiresAdmin: true,
    cardProps: {
      title: 'Gestisci Utenti',
      description: 'Amministra gli utenti',
      href: '/admin/users',
      icon: 'users',
    },
  },

  SYSTEM_SETTINGS: {
    id: 'system-settings',
    category: 'system',
    requiresAdmin: true,
    cardProps: {
      title: 'Impostazioni',
      description: 'Configurazioni sistema',
      href: '/admin/settings',
      icon: 'cog',
    },
  },

  // === IMPORT/EXPORT ===
  EXPORT_DATA: {
    id: 'export-data',
    category: 'system',
    requiresAdmin: true,
    cardProps: {
      title: 'Esporta Dati',
      description: 'Backup del sistema',
      href: '/admin/export',
      icon: 'arrow-down',
    },
  },

  IMPORT_DATA: {
    id: 'import-data',
    category: 'system',
    requiresAdmin: true,
    cardProps: {
      title: 'Importa Dati',
      description: 'Carica dati esterni',
      href: '/admin/import',
      icon: 'arrow-up',
    },
  },
} as const;

/**
 * Preset di azioni per diverse dashboard
 */
export const ACTION_PRESETS = {
  /** Azioni principali per la dashboard admin */
  ADMIN_DASHBOARD: [
    QUICK_ACTIONS.CREATE_GUIDE,
    QUICK_ACTIONS.MANAGE_CATEGORIES,
    QUICK_ACTIONS.VIEW_SITE,
  ],

  /** Azioni per gestione contenuti */
  CONTENT_MANAGEMENT: [
    QUICK_ACTIONS.CREATE_GUIDE,
    QUICK_ACTIONS.CREATE_CATEGORY,
    QUICK_ACTIONS.MANAGE_GUIDES,
    QUICK_ACTIONS.MANAGE_CATEGORIES,
  ],

  /** Azioni di sistema */
  SYSTEM_MANAGEMENT: [
    QUICK_ACTIONS.SYSTEM_SETTINGS,
    QUICK_ACTIONS.MANAGE_USERS,
    QUICK_ACTIONS.EXPORT_DATA,
    QUICK_ACTIONS.IMPORT_DATA,
  ],

  /** Azioni per analisi */
  ANALYTICS: [
    QUICK_ACTIONS.VIEW_ANALYTICS,
    QUICK_ACTIONS.VIEW_SITE,
    QUICK_ACTIONS.EXPORT_DATA,
  ],
} as const;

/**
 * Helper per filtrare azioni basate sui permessi dell'utente
 */
export function filterActionsByPermissions(
  actions: QuickActionConfig[],
  isAdmin: boolean = false
): QuickActionConfig[] {
  return actions.filter(
    (action) => !action.requiresAdmin || (action.requiresAdmin && isAdmin)
  );
}

/**
 * Helper per ottenere azioni per categoria
 */
export function getActionsByCategory(
  category: QuickActionConfig['category']
): QuickActionConfig[] {
  return Object.values(QUICK_ACTIONS).filter(
    (action) => action.category === category
  );
}
