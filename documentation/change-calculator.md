## **Algoritmo di Calcolo del Resto (`calculateChange`)**

### **Descrizione**
La funzione `calculateChange` calcola il resto da restituire a un cliente dopo aver ricevuto un pagamento per un conto. Utilizza un approccio **greedy** per determinare il numero minimo di banconote e monete necessarie per coprire il resto.

### **Input**
- **`billTotal`**: Il totale del conto in euro (numero decimale).
- **`cashReceived`**: Il denaro ricevuto dal cliente in euro (numero decimale).

### **Output**
- Un array di oggetti di tipo `ChangeBreakdown`, dove ogni oggetto rappresenta una denominazione utilizzata nel resto:
  ```typescript
  {
    denomination: number; // Valore della denominazione in euro
    count: number;        // Numero di unità di quella denominazione
    type: "bill" | "coin"; // Tipo: banconota o moneta
  }
  ```

### **Algoritmo**
1. **Calcolo del resto**:
   - Calcola il resto come differenza tra `cashReceived` e `billTotal`.
   - Se il resto è negativo (il cliente non ha pagato abbastanza), restituisce un array vuoto (`[]`).

2. **Conversione in centesimi**:
   - Converte il resto in centesimi moltiplicandolo per 100 e arrotondandolo con `Math.round`. Questo evita problemi di precisione legati ai numeri decimali.

3. **Iterazione sulle denominazioni**:
   - L'array `DENOMINATIONS` contiene le banconote e monete disponibili, ordinate in modo decrescente.
   - Per ogni denominazione:
     - Verifica quante volte può essere sottratta dal resto rimanente.
     - Aggiorna il resto sottraendo il valore utilizzato.
     - Crea un oggetto che descrive la denominazione utilizzata e lo aggiunge al risultato finale.

4. **Restituzione del risultato**:
   - Restituisce l'array contenente il dettaglio del resto suddiviso per denominazione.

### **Esempio**
#### Input:
```javascript
const billTotal = 37.85;
const cashReceived = 50.00;
```

#### Output:
```javascript
[
  { denomination: 10, count: 1, type: "bill" },
  { denomination: 2, count: 1, type: "coin" },
  { denomination: 0.10, count: 1, type: "coin" },
  { denomination: 0.05, count: 1, type: "coin" }
]
```

### **Note**
- **Precisione**: La conversione in centesimi garantisce che i calcoli siano esatti, evitando errori di arrotondamento associati ai numeri in virgola mobile.
- **Estensibilità**: È facile aggiungere nuove denominazioni modificando l'array `DENOMINATIONS`.

---

## **2. Funzione di Formattazione della Valuta (`formatCurrency`)**

### **Descrizione**
La funzione `formatCurrency` formatta un importo in euro secondo le convenzioni italiane. Usa l'API `Intl.NumberFormat` per garantire che il formato sia corretto e adatto al contesto internazionale.

### **Input**
- **`amount`**: L'importo in euro (numero decimale).

### **Output**
- Una stringa formattata come valuta italiana. Ad esempio:
  - Input: `12.15`
  - Output: `"€12,15"`

### **Algoritmo**
1. **Formattazione**:
   - Usa `Intl.NumberFormat` con le seguenti opzioni:
     - Locale: `"it-IT"` (italiano, Italia).
     - Stile: `"currency"` (valuta).
     - Valuta: `"EUR"` (euro).
     - Numero di cifre decimali: sempre due (`minimumFractionDigits: 2`, `maximumFractionDigits: 2`).

2. **Restituzione del risultato**:
   - Restituisce la stringa formattata.

### **Esempio**
#### Input:
```javascript
const amount = 12.15;
```

#### Output:
```javascript
"€12,15"
```

### **Note**
- **Separatore decimale**: In italiano, il separatore decimale è una virgola (`,`), mentre in altre lingue potrebbe essere un punto (`.`).
- **Simbolo della valuta**: Il simbolo dell'euro (`€`) viene automaticamente aggiunto all'inizio del numero grazie all'opzione `"currency"`.
- **Internazionalizzazione**: Modificando il locale (ad esempio, `"en-US"`), è possibile adattare il formato a diverse lingue e regioni.

---

## **3. Tipi Utilizzati**

### **`ChangeBreakdown`**
```typescript
export type ChangeBreakdown = {
  denomination: number; // Valore della denominazione in euro
  count: number;        // Numero di unità di quella denominazione
  type: "bill" | "coin"; // Tipo: banconota o moneta
}
```

- Descrive un singolo elemento del dettaglio del resto.

---

## **4. Array delle Denominazioni (`DENOMINATIONS`)**

### **Descrizione**
L'array `DENOMINATIONS` contiene tutte le banconote e monete disponibili, espresse in centesimi. Ogni oggetto ha due proprietà:
- `value`: Il valore della denominazione in centesimi.
- `type`: Il tipo (`"bill"` per banconote, `"coin"` per monete).

### **Contenuto**
```javascript
const DENOMINATIONS = [
  { value: 5000, type: "bill" }, // €50
  { value: 2000, type: "bill" }, // €20
  { value: 1000, type: "bill" }, // €10
  { value: 500, type: "bill" },  // €5
  { value: 200, type: "coin" },  // €2
  { value: 100, type: "coin" },  // €1
  { value: 50, type: "coin" },   // €0.50
  { value: 20, type: "coin" },   // €0.20
  { value: 10, type: "coin" },   // €0.10
  { value: 5, type: "coin" },    // €0.05
  { value: 2, type: "coin" },    // €0.02
  { value: 1, type: "coin" },    // €0.01
]
```

### **Note**
- Le denominazioni sono ordinate in modo decrescente per facilitare l'algoritmo greedy.
- I valori sono espressi in centesimi per evitare problemi di precisione.

---

