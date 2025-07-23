## **Interfaccia Utente: `ChangeCalculator`**

### **Descrizione**
Il componente `ChangeCalculator` è un'applicazione React che permette all'utente di calcolare il resto da restituire dopo aver ricevuto un pagamento. L'interfaccia è progettata per essere funzionale e intuitiva, fornendo feedback immediati e risultati chiari.

---

## **1. Struttura Funzionale**

L'interfaccia è suddivisa in tre sezioni principali:
1. **Header**: Fornisce un contesto visivo e informa l'utente sullo scopo dell'applicazione.
2. **Input Card**: Contiene i campi di input e i pulsanti per inserire i dati e avviare il calcolo.
3. **Risultati**: Mostra il resto totale e il dettaglio suddiviso per denominazione.

---

## **2. Header**

### **Funzione**
- Fornisce un titolo descrittivo ("Coffee Break") e un'icona (simbolo dell'euro) per identificare l'applicazione come un calcolatore di resto.

### **Componenti**
- **Icona (`Euro`)**:
  - Simbolo dell'euro visualizzato usando la libreria `lucide-react`.
- **Titolo**:
  - Testo "Coffee Break" accompagnato da una breve descrizione ("Calcolatore di Resto").

---

## **3. Input Card**

### **Funzione**
La sezione `Input Card` gestisce l'inserimento dei dati necessari per il calcolo del resto. Contiene due campi di input e due pulsanti.

### **Campi di Input**
#### **Totale Conto**
- **Etichetta**: "Totale Conto (€)".
- **Campo di testo**:
  - Accetta solo numeri e decimali.
  - Supporta sia il punto (`.`) che la virgola (`,`) come separatore decimale.
  - Gestito dalla funzione `handleInputChange` per sanificare l'input.
- **Validazione**:
  - Verifica che il valore inserito sia un numero valido e maggiore di zero.

#### **Contante Ricevuto**
- **Etichetta**: "Contante Ricevuto (€)".
- **Campo di testo**:
  - Funziona esattamente come il campo "Totale Conto".
  - Verifica che il valore inserito sia sufficiente a coprire il conto.

### **Pulsanti**
#### **CALCOLA**
- **Funzione**: Avvia il calcolo del resto chiamando la funzione `handleCalculate`.
- **Condizioni di attivazione**:
  - Il pulsante è disabilitato se uno dei campi di input è vuoto o contiene valori non validi.

#### **Reset**
- **Funzione**: Resetta tutti i campi e nasconde i risultati chiamando la funzione `handleReset`.

### **Messaggi di Errore**
- Se l'utente inserisce valori non validi o insufficienti, viene mostrato un messaggio di errore:
  - Esempi:
    - "Inserisci importi validi".
    - "Il totale deve essere maggiore di zero".
    - "Il contante ricevuto è insufficiente".

---

## **4. Risultati**

### **Funzione**
La sezione dei risultati mostra il resto totale e il dettaglio suddiviso per denominazione. Appare solo dopo aver premuto il pulsante "CALCOLA".

### **Resto Totale**
- **Etichetta**: "Resto da Dare".
- **Valore**:
  - Importo formattato come valuta italiana (es. `"€12,15"`).
  - Calcolato dalla funzione `calculateChange` e formattato con `formatCurrency`.

### **Dettaglio del Resto**
- **Elenco delle denominazioni utilizzate**:
  - Per ogni denominazione:
    - Icona:
      - Banconote: `Banknote` (libreria `lucide-react`).
      - Monete: `Coins` (libreria `lucide-react`).
    - Descrizione:
      - Valore della denominazione (es. `"€10 Banconote"`).
      - Numero di unità utilizzate.
  - Generato dalla funzione `calculateChange`.

---

## **5. Funzioni Principali**

### **`handleInputChange`**
```typescript
const handleInputChange = (field: "billTotal" | "cashReceived", value: string) => { ... }
```

- **Funzione**:
  - Gestisce i cambiamenti nei campi di input (`billTotal` e `cashReceived`).
  - Rimuove caratteri non validi e converte la virgola in punto decimale.
- **Uso**:
  - Chiamata quando l'utente modifica uno dei campi di input.

---

### **`handleCalculate`**
```typescript
const handleCalculate = () => { ... }
```

- **Funzione**:
  - Converte gli input in numeri e verifica la loro validità.
  - Calcola il resto chiamando la funzione `calculateChange`.
  - Aggiorna lo stato con il resto calcolato e il dettaglio per denominazione.
- **Validazione**:
  - Controlla che gli input siano numeri validi.
  - Verifica che il totale del conto sia maggiore di zero.
  - Assicura che il denaro ricevuto sia sufficiente a coprire il conto.
- **Uso**:
  - Chiamata quando l'utente preme il pulsante "CALCOLA".

---

### **`handleReset`**
```typescript
const handleReset = () => { ... }
```

- **Funzione**:
  - Resetta tutti i campi dello stato ai loro valori iniziali.
  - Nasconde i risultati e cancella eventuali messaggi di errore.
- **Uso**:
  - Chiamata quando l'utente preme il pulsante "Reset".

---

## **6. Flusso di Interazione**

1. **Inserimento degli importi**:
   - L'utente inserisce il totale del conto e il denaro ricevuto nei campi di input.
   - Gli input vengono sanificati e validati in tempo reale.

2. **Calcolo del resto**:
   - Premendo il pulsante "CALCOLA", la funzione `handleCalculate` verifica gli input e calcola il resto.
   - Se ci sono errori, viene mostrato un messaggio di errore.

3. **Visualizzazione dei risultati**:
   - Il resto totale e il dettaglio per denominazione vengono visualizzati.

4. **Reset**:
   - Premendo il pulsante "Reset", tutti i campi e i risultati vengono ripristinati allo stato iniziale.

---

## **7. Conclusione**

Questa documentazione descrive in dettaglio l'interfaccia utente del componente `ChangeCalculator`, focalizzandosi sulle funzionalità e sul ruolo delle funzioni principali. Le sezioni principali (Header, Input Card, Risultati) sono state descritte in termini di comportamento e interazioni, senza includere dettagli stilistici o animazioni.
