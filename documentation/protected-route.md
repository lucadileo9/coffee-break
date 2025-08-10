# **Documentazione: Protezione delle Route in un'Applicazione Next.js con Supabase**

## **1. Introduzione**
La protezione delle route è fondamentale per garantire che solo utenti autorizzati possano accedere a determinate sezioni dell'applicazione. In questo documento, descriveremo:
- Il **meccanismo generale** di protezione delle rotte.
- L'implementazione del componente `ProtectedRoute`.
- Come usare il componente per proteggere rotte autenticate e riservate agli admin.

---

## **2. Meccanismo Generale di Protezione delle Route**

### **2.1. Cosa Significa Proteggere una Route?**
Proteggere una route significa impedire l'accesso a determinate pagine o contenuti se l'utente non soddisfa specifici criteri, ad esempio:
- Non è autenticato.
- Non ha i permessi necessari (es. ruolo admin).

### **2.2. Flusso di Protezione**
Il flusso generale per proteggere una route è il seguente:
1. **Verifica dello Stato di Autenticazione**:
   - Controlla se esiste una sessione valida (`isAuthenticated`).
   - Se non c'è sessione, reindirizza l'utente alla pagina di login o mostra un fallback.

2. **Controllo dei Ruoli (Opzionale)**:
   - Se la route richiede permessi speciali (es. ruolo admin), verifica se l'utente ha i requisiti necessari (`isAdmin`).

3. **Rendering del Contenuto Protetto**:
   - Se l'utente soddisfa tutti i requisiti, mostra il contenuto protetto.

4. **Gestione degli Stati di Caricamento**:
   - Durante il recupero della sessione, mostra uno stato di caricamento per migliorare l'esperienza utente.

---

## **3. Implementazione del Componente `ProtectedRoute`**

### **3.1. Codice Completo**
```tsx
import React from 'react';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import SimpleTitle from '@/components/atoms/SimpleTitle';
import LoginForm from '@/components/organisms/LoginForm';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute - Componente per proteggere route che richiedono autenticazione
 * 
 * Features:
 * - Protezione route authenticated
 * - Controllo ruoli admin
 * - Loading states
 * - Fallback personalizzabili
 */
export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Non autenticato
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Reindirizza alla pagina di login
    router.push('/login');
    return null;
  }

  // Autenticato ma non admin (se richiesto)
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <SimpleTitle level="h1">Accesso Negato</SimpleTitle>
          
          <ErrorMessage
            variant="warning"
            title="Autorizzazione Insufficiente"
            message="Non hai i permessi necessari per accedere a questa sezione."
            details={`Connesso come: ${user?.email}`}
          />
          
          <div className="text-sm text-muted-foreground">
            Contatta l&apos;amministratore se pensi che sia un errore
          </div>
        </div>
      </div>
    );
  }

  // Tutto ok, mostra contenuto protetto
  return <>{children}</>;
}
```

---

### **3.2. Spiegazione Passo-Passo**

#### **a) Verifica dello Stato di Caricamento**
- Quando l'applicazione viene caricata, lo stato di autenticazione potrebbe non essere ancora disponibile (`loading === true`).
- Durante questo periodo, viene mostrato un indicatore di caricamento per migliorare l'esperienza utente.

#### **b) Utente Non Autenticato**
- Se `isAuthenticated` è `false`, l'utente non è autenticato.
- Il componente reindirizza automaticamente l'utente alla pagina di login (`/login`) o mostra un fallback personalizzato (se fornito).

#### **c) Utente Autenticato ma Non Admin**
- Se la route richiede un ruolo admin (`requireAdmin === true`) e l'utente non ha i permessi necessari (`isAdmin === false`), viene mostrato un messaggio di accesso negato.
- Il messaggio include informazioni utili, come l'email dell'utente corrente e istruzioni su come procedere.

#### **d) Rendering del Contenuto Protetto**
- Se l'utente soddisfa tutti i requisiti, il contenuto protetto (`children`) viene reso.

---

## **4. Come Usare il Componente `ProtectedRoute`**

### **4.1. Esempio: Protezione di una Route Generica**
Se vuoi proteggere una route che richiede solo autenticazione (senza ruoli specifici):
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```
- Solo utenti autenticati possono accedere alla dashboard.

---

### **4.2. Esempio: Protezione di una Route Riservata agli Admin**
Se vuoi proteggere una route che richiede permessi di admin:
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminPanel from '@/components/AdminPanel';

function App() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPanel />
    </ProtectedRoute>
  );
}
```
- Solo utenti autenticati con ruolo admin possono accedere al pannello admin.

---

### **4.3. Esempio: Fallback Personalizzato**
Se vuoi mostrare un componente personalizzato quando l'utente non è autorizzato:
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomFallback from '@/components/CustomFallback';
import PrivateContent from '@/components/PrivateContent';

function App() {
  return (
    <ProtectedRoute fallback={<CustomFallback />}>
      <PrivateContent />
    </ProtectedRoute>
  );
}
```
- Se l'utente non è autorizzato, viene mostrato il componente `CustomFallback`.

---

## **5. Considerazioni di Sicurezza**

### **5.1. Verifica Backend**
Anche se il frontend gestisce la logica di protezione delle rotte, **non fidarti mai del frontend per proteggere risorse sensibili**. Assicurati che:
- Le API routes verifichino sempre i permessi sul backend.
- Ad esempio, usa middleware o policy per garantire che solo utenti autorizzati possano accedere a determinate risorse.

### **5.2. Gestione del Logout**
Se un utente effettua il logout mentre sta visualizzando una route protetta, assicurati che venga reindirizzato correttamente. Questo è già gestito dal listener `onAuthStateChange`, ma puoi aggiungere un controllo esplicito per sicurezza.

---