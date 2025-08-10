# Sistema di Autenticazione - Documentazione Completa

## Panoramica

Il sistema di autenticazione è composto da diversi livelli che lavorano insieme per garantire la sicurezza delle API:

## 🏗️ Architettura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   API Routes    │───▶│   Supabase      │
│   (Client)      │    │   (Server)      │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
    AuthContext             auth-utils.ts           Auth Backend
   (login/logout)          (token verification)    (user sessions)
```

## 📁 Componenti Principali

### 1. **AuthContext** (Frontend - Client Side)
**File**: `components/providers/AuthContext.tsx`

**Responsabilità**:
- Gestisce lo stato di autenticazione globale dell'app
- Fornisce funzioni di login/logout ai componenti
- Mantiene le informazioni dell'utente corrente
- Reindirizzamenti automatici dopo login/logout

**Come funziona**:
```typescript
// Quando l'utente fa login
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (data.session) {
    setUser(data.user);  // Salva utente nello stato
    router.push('/admin'); // Reindirizza alla dashboard
  }
};

// Il token viene automaticamente salvato da Supabase nei cookie
```

### 2. **auth-utils.ts** (Backend - Server Side)
**File**: `lib/auth-utils.ts`

**Responsabilità**:
- Verifica i token di autenticazione nelle API routes
- Controlla se l'utente è amministratore
- Fornisce middleware per proteggere le API

## 🔐 Flusso di Autenticazione Completo

### Fase 1: Login dell'utente
```
1. Utente inserisce email/password nel form di login
2. AuthContext chiama supabase.auth.signInWithPassword()
3. Supabase verifica le credenziali
4. Se valide, Supabase restituisce:
   - User object (con email, id, metadata)
   - Session object (con access_token, refresh_token)
5. Il browser salva automaticamente i token nei cookie
6. AuthContext aggiorna lo stato globale con l'utente
7. Reindirizzamento automatico alla dashboard admin
```

### Fase 2: Protezione delle API Routes
```
1. Frontend fa una richiesta a un'API protetta (es. POST /api/guides)
2. Supabase aggiunge automaticamente l'header Authorization: Bearer <token>
3. La route API chiama requireAuth(request, true)
4. auth-utils estrae il token dall'header Authorization
5. Verifica il token con Supabase
6. Controlla se l'email è nella lista admin
7. Se tutto ok, l'API procede
8. Altrimenti restituisce 401 Unauthorized
```

## 🛡️ Controlli di Sicurezza

### Livello 1: Verifica Token
```typescript
// In auth-utils.ts
const authHeader = request.headers.get('authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return { error: 'Token mancante' };
}

const token = authHeader.substring(7); // Rimuove "Bearer "
const { data: { user }, error } = await supabase.auth.getUser(token);
```

### Livello 2: Verifica Admin
```typescript
// Lista email admin (in produzione dovrebbe venire da DB o ENV)
const ADMIN_EMAILS = ['lucadileo70@gmail.com', 'marco.krt@libero.it'];

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
```

### Livello 3: Middleware API
```typescript
// In ogni API route protetta
export async function POST(request: NextRequest) {
  // Controllo autenticazione richiesto per admin
  const authError = await requireAuth(request, true);
  if (authError) {
    return NextResponse.json(
      { error: authError.error },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }
  
  // Se arriviamo qui, l'utente è autenticato e admin
  // Procediamo con la logica dell'API
}
```

## 🔄 Gestione delle Sessioni

### Refresh Token Automatico
```typescript
// Supabase gestisce automaticamente il refresh dei token
// Quando un token scade, Supabase:
// 1. Usa il refresh_token per ottenere un nuovo access_token
// 2. Aggiorna automaticamente i cookie
// 3. Le richieste successive usano il nuovo token
```

### Logout
```typescript
const logout = async () => {
  await supabase.auth.signOut(); // Invalida tutti i token
  setUser(null);                 // Rimuove utente dallo stato
  router.push('/');             // Reindirizza alla home
};
```

## 🚨 Gestione Errori

### Errori di Autenticazione
- **401 Unauthorized**: Token mancante, scaduto o non valido
- **403 Forbidden**: Utente autenticato ma non admin
- **400 Bad Request**: Dati di login non validi

### Sicurezza Aggiuntiva
```typescript
// Protezione contro attacchi di forza bruta
// Rate limiting (da implementare se necessario)
// Validazione input sempre presente
// Escape di parametri SQL (Supabase lo fa automaticamente)
```

## 📊 Vantaggi del Sistema Attuale

1. **Separation of Concerns**: Client e server hanno responsabilità separate
2. **Type Safety**: TypeScript garantisce tipizzazione corretta
3. **Centralizzazione**: auth-utils centralizza tutta la logica server-side
4. **Flessibilità**: requireAuth può richiedere o meno permessi admin
5. **Manutenibilità**: Facile aggiungere nuovi controlli o modificare esistenti