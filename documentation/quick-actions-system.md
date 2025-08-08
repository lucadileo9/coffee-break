# Sistema Quick Actions

## Panoramica

Il **Sistema Quick Actions** è un framework centralizzato per gestire le azioni rapide nell'interfaccia amministrativa. Fornisce un modo consistente, scalabile e sicuro per configurare collegamenti e funzionalità frequentemente utilizzate.

### Vantaggi Principali

- 🎯 **Centralizzazione**: Tutte le configurazioni in un unico file
- 🔄 **Riusabilità**: Preset combinabili per diverse dashboard
- 🔒 **Sicurezza**: Sistema di permessi integrato
- 🛠️ **Manutenibilità**: Modifiche centrali si propagano ovunque
- 📱 **Responsività**: Layout automatico e icone unificate
- 🎨 **Consistenza**: Design system integrato con MyIcon

## Architettura

### File di Configurazione
```
lib/quick-actions-config.ts
├── QUICK_ACTIONS          # Definizioni delle singole azioni
├── ACTION_PRESETS         # Combinazioni predefinite
└── Helper Functions       # Utility per filtraggio e categorizzazione
```

### Componenti Coinvolti
```
components/
├── atoms/QuickActionCard/           # Card singola per ogni azione
├── molecules/QuickActionsGrid/      # Griglia contenitore
└── organisms/AdminDashboard/        # Dashboard che utilizza le azioni
```

### Flusso di Utilizzo
```
Configurazione → Filtri → Rendering → Interazione
     ↓              ↓         ↓          ↓
quick-actions   Helper    QuickActions  Navigazione
   config      Functions     Grid
```

## Configurazione delle Azioni

### Struttura di una Quick Action

```typescript
interface QuickActionConfig {
  id: string;                    // Identificatore univoco
  category: ActionCategory;      // Categoria logica
  requiresAdmin: boolean;        // Livello di permessi richiesto
  cardProps: {                   // Proprietà per il rendering
    title: string;               // Titolo visualizzato
    description: string;         // Descrizione breve
    href: string;                // URL di destinazione
    icon: IconName;              // Nome icona MyIcon
    external?: boolean;          // Link esterno (default: false)
  };
}
```

### Categorie Disponibili

| Categoria | Descrizione | Esempi |
|-----------|-------------|---------|
| `content` | Creazione di nuovi contenuti | Nuova Guida, Nuova Categoria |
| `management` | Gestione contenuti esistenti | Gestisci Guide, Gestisci Categorie |
| `system` | Amministrazione sistema | Utenti, Impostazioni, Backup |
| `external` | Collegamenti esterni | Frontend, Documentazione |

### Esempio di Configurazione

```typescript
CREATE_GUIDE: {
  id: 'create-guide',
  category: 'content',
  requiresAdmin: true,
  cardProps: {
    title: 'Nuova Guida',
    description: 'Crea una nuova guida per gli utenti',
    href: '/admin/guides/create',
    icon: 'plus',
  },
},
```

## Preset e Combinazioni

### Preset Predefiniti

#### `ADMIN_DASHBOARD`
Azioni principali per la dashboard amministrativa
```typescript
ADMIN_DASHBOARD: [
  QUICK_ACTIONS.CREATE_GUIDE,
  QUICK_ACTIONS.MANAGE_CATEGORIES,
  QUICK_ACTIONS.VIEW_SITE,
]
```

#### `CONTENT_MANAGEMENT`
Gestione completa dei contenuti
```typescript
CONTENT_MANAGEMENT: [
  QUICK_ACTIONS.CREATE_GUIDE,
  QUICK_ACTIONS.CREATE_CATEGORY,
  QUICK_ACTIONS.MANAGE_GUIDES,
  QUICK_ACTIONS.MANAGE_CATEGORIES,
]
```

#### `SYSTEM_MANAGEMENT`
Amministrazione di sistema
```typescript
SYSTEM_MANAGEMENT: [
  QUICK_ACTIONS.SYSTEM_SETTINGS,
  QUICK_ACTIONS.MANAGE_USERS,
  QUICK_ACTIONS.EXPORT_DATA,
  QUICK_ACTIONS.IMPORT_DATA,
]
```

#### `ANALYTICS`
Analisi e reportistica
```typescript
ANALYTICS: [
  QUICK_ACTIONS.VIEW_ANALYTICS,
  QUICK_ACTIONS.VIEW_SITE,
  QUICK_ACTIONS.EXPORT_DATA,
]
```

### Creare Preset Personalizzati

```typescript
// Esempio: Dashboard per Editor di Contenuti
const EDITOR_DASHBOARD = [
  QUICK_ACTIONS.CREATE_GUIDE,
  QUICK_ACTIONS.MANAGE_GUIDES,
  QUICK_ACTIONS.VIEW_SITE,
];

```

## Sistema di Permessi

### Livelli di Accesso

| Livello | `requiresAdmin` | Accesso |
|---------|-----------------|---------|
| **Pubblico** | `false` | Tutti gli utenti autenticati |
| **Admin** | `true` | Solo amministratori |

### Filtraggio Automatico

```typescript
// Filtra azioni basandosi sui permessi dell'utente
const availableActions = filterActionsByPermissions(
  ACTION_PRESETS.CONTENT_MANAGEMENT,
  user.isAdmin
);

// Utente normale: vedrà solo azioni con requiresAdmin: false
// Amministratore: vedrà tutte le azioni
```

### Implementazione nei Componenti

```typescript
function AdminDashboard({ user }: { user: User }) {
  const actions = useMemo(() => 
    filterActionsByPermissions(
      ACTION_PRESETS.ADMIN_DASHBOARD,
      user.role === 'admin'
    ), [user.role]
  );

  return <QuickActionsGrid actions={actions} />;
}
```

## Utilizzo nei Componenti

### Dashboard Semplice

```typescript
import { ACTION_PRESETS } from '@/lib/quick-actions-config';

export function AdminDashboard() {
  return (
    <div>
      <h1>Dashboard Amministrativa</h1>
      <QuickActionsGrid actions={ACTION_PRESETS.ADMIN_DASHBOARD} />
    </div>
  );
}
```

### Dashboard Multi-Sezione

```typescript
export function ComprehensiveDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <section>
        <h2>Azioni Rapide</h2>
        <QuickActionsGrid 
          actions={filterActionsByPermissions(
            ACTION_PRESETS.ADMIN_DASHBOARD,
            user?.role === 'admin'
          )} 
        />
      </section>
      
      <section>
        <h2>Gestione Contenuti</h2>
        <QuickActionsGrid 
          actions={filterActionsByPermissions(
            ACTION_PRESETS.CONTENT_MANAGEMENT,
            user?.role === 'admin'
          )} 
        />
      </section>
    </div>
  );
}
```

## Helper Functions

### `filterActionsByPermissions`

Filtra le azioni basandosi sui permessi dell'utente.

```typescript
function filterActionsByPermissions(
  actions: QuickActionConfig[],
  isAdmin: boolean = false
): QuickActionConfig[]
```

**Parametri:**
- `actions`: Array di azioni da filtrare
- `isAdmin`: Se l'utente ha permessi amministrativi

**Ritorna:** Array filtrato di azioni accessibili all'utente

**Esempio:**
```typescript
const userActions = filterActionsByPermissions(
  ACTION_PRESETS.SYSTEM_MANAGEMENT,
  false // Utente normale
);
// Ritorna solo azioni con requiresAdmin: false
```

### `getActionsByCategory`

Ottiene tutte le azioni di una specifica categoria.

```typescript
function getActionsByCategory(
  category: ActionCategory
): QuickActionConfig[]
```

**Parametri:**
- `category`: Categoria da filtrare (`'content' | 'management' | 'system' | 'external'`)

**Ritorna:** Array di azioni della categoria specificata

**Esempio:**
```typescript
const contentActions = getActionsByCategory('content');
// Ritorna: [CREATE_GUIDE, CREATE_CATEGORY, ...]
```


## Esempi Pratici

### Scenario 1: Nuova Funzionalità Blog

```typescript
// 1. Aggiungi le nuove azioni
BLOG_ACTIONS = {
  CREATE_POST: {
    id: 'create-post',
    category: 'content',
    requiresAdmin: false, // Anche gli editor possono creare
    cardProps: {
      title: 'Nuovo Post',
      description: 'Scrivi un nuovo articolo del blog',
      href: '/admin/blog/create',
      icon: 'edit',
    },
  },
  
  MANAGE_POSTS: {
    id: 'manage-posts',
    category: 'management',
    requiresAdmin: false,
    cardProps: {
      title: 'Gestisci Post',
      description: 'Modifica e pubblica i tuoi articoli',
      href: '/admin/blog',
      icon: 'file-text',
    },
  },
};

// 2. Crea preset per blog
BLOG_DASHBOARD: [
  QUICK_ACTIONS.CREATE_POST,
  QUICK_ACTIONS.MANAGE_POSTS,
  QUICK_ACTIONS.VIEW_SITE,
],

// 3. Usa nel componente
<QuickActionsGrid actions={ACTION_PRESETS.BLOG_DASHBOARD} />
```

### Scenario 2: Dashboard Personalizzata per Ruolo

```typescript
function getRoleBasedActions(userRole: string): QuickActionConfig[] {
  switch (userRole) {
    case 'super_admin':
      return [
        ...ACTION_PRESETS.ADMIN_DASHBOARD,
        ...ACTION_PRESETS.SYSTEM_MANAGEMENT,
      ];
      
    case 'admin':
      return ACTION_PRESETS.ADMIN_DASHBOARD;
      
    case 'editor':
      return ACTION_PRESETS.CONTENT_MANAGEMENT;
      
    case 'viewer':
      return [QUICK_ACTIONS.VIEW_SITE, QUICK_ACTIONS.VIEW_ANALYTICS];
      
    default:
      return [];
  }
}

// Uso nel componente
const userActions = getRoleBasedActions(user.role);
<QuickActionsGrid actions={userActions} />
```