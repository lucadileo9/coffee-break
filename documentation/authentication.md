# **Documentazione: Sistema di Autenticazione con Supabase e React Context**

## **1. Panoramica**
Questo documento descrive il sistema di autenticazione implementato in un'applicazione Next.js utilizzando **Supabase** e **React Context**. L'obiettivo è fornire una panoramica chiara dei meccanismi di autenticazione, gestione della sessione e protezione delle rotte.

---

## **2. Architettura Generale**

### **Componenti Principali**
1. **Supabase Backend**:
   - Database PostgreSQL per memorizzare utenti e sessioni.
   - Servizio GoTrue per gestire l'autenticazione (JWT, refresh token, ecc.).

2. **Frontend**:
   - React Context (`AuthProvider`) per gestire lo stato globale di autenticazione.
   - Hook personalizzato (`useAuth`) per accedere ai dati dell'utente e ai metodi di autenticazione.

3. **Flusso di Autenticazione**:
   - Login/Logout tramite API RESTful di Supabase.
   - Gestione automatica della sessione con `onAuthStateChange`.
   - Protezione delle rotte tramite middleware o componenti protetti.

---

## **3. Workflow di Autenticazione**

### **3.1. Login**
#### **Diagramma di Flusso**
```plaintext
Utente inserisce credenziali
       ↓
Chiamata a supabase.auth.signInWithPassword()
       ↓
Richiesta POST al backend GoTrue (/auth/v1/token)
       ↓
Verifica credenziali nel database PostgreSQL
       ↓
Generazione JWT e refresh token
       ↓
Salvataggio token nel browser (localStorage/cookie)
       ↓
Aggiornamento stato locale tramite onAuthStateChange
```

#### **Codice Presente**
```typescript
const signIn = async (email: string, password: string) => {
  setLoading(true);
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  setLoading(false);
  return { error };
};
```

#### **Spiegazione**
- Il metodo `signIn` invia le credenziali al backend.
- Se il login ha successo, Supabase salva automaticamente i token nel browser.
- Lo stato globale (`user`, `session`) viene aggiornato tramite il listener `onAuthStateChange`. Ossia:
```typescript
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
```

---

### **3.2. Logout**
#### **Diagramma di Flusso**
```plaintext
Utente fa clic su "Logout"
       ↓
Chiamata a supabase.auth.signOut()
       ↓
Richiesta POST al backend GoTrue (/auth/v1/logout)
       ↓
Invalidazione del refresh token
       ↓
Cancellazione token dal browser
       ↓
Aggiornamento stato locale tramite onAuthStateChange
```

#### **Codice di Esempio**
```typescript
const signOut = async () => {
  setLoading(true);
  
  const { error } = await supabase.auth.signOut();
  
  if (!error) {
    setUser(null);
    setSession(null);
  }
  
  setLoading(false);
  return { error };
};
```

#### **Spiegazione**
- Il metodo `signOut` invalida il refresh token e cancella i token dal browser.
- Lo stato globale (`user`, `session`) viene reimpostato su `null`.

---

### **3.3. Recupero della Sessione**
#### **Diagramma di Flusso**
```plaintext
Caricamento dell'applicazione
       ↓
Chiamata a supabase.auth.getSession()
       ↓
Verifica token JWT nel browser
       ↓
Recupero dettagli sessione dal backend
       ↓
Aggiornamento stato locale (user, session)
```

#### **Codice di Esempio**
```typescript
useEffect(() => {
  const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
    } else {
      setSession(session);
      setUser(session?.user ?? null);
    }
    
    setLoading(false);
  };

  getSession();
}, []);
```

#### **Spiegazione**
- Quando l'applicazione viene caricata, `getSession` recupera la sessione corrente.
- Se il token JWT è valido, vengono restituiti i dettagli della sessione.
- Lo stato globale (`user`, `session`) viene aggiornato.

---

## **4. Gestione dello Stato Globale**

### **4.1. React Context**
#### **Struttura del Contesto**
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
```

#### **Provider**
```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inizializza sessione e aggiorna stato locale
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### **Hook Personalizzato**
```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
```

#### **Spiegazione**
- `AuthProvider` gestisce lo stato globale di autenticazione.
- `useAuth` fornisce un modo semplice per accedere allo stato globale nei componenti.

---

## **5. Protezione delle Rotte**

### **5.1. Middleware (Next.js)**
#### **Codice di Esempio**
```typescript
export async function middleware(request: any) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

#### **Spiegazione**
- Il middleware verifica se esiste una sessione valida.
- Se non esiste, reindirizza l'utente alla pagina di login.

---

### **5.2. Componente Protetto**
#### **Codice di Esempio**
```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
```

#### **Spiegazione**
- Il componente verifica se l'utente è autenticato.
- Se non è autenticato, reindirizza alla pagina di login.

---

## **6. Controllo dei Ruoli**

### **6.1. Verifica Admin**
#### **Codice di Esempio**
```typescript
const isAdmin = !!user && (
  user.email === 'admin@jemore.it' || 
  user.user_metadata?.role === 'admin' ||
  user.app_metadata?.role === 'admin'
);
```

#### **Spiegazione**
- Usa `user_metadata` o `app_metadata` per verificare i ruoli.
- Proteggi sempre le risorse sensibili sul backend.

---

