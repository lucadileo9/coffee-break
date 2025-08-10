# MyIcon Component

La componente `MyIcon` è un wrapper tipizzato e sicuro per la visualizzazione di
icone Lucide in React.  
Gestisce la selezione dell’icona tramite nome, garantendo che solo i nomi validi
vengano accettati, e offre flessibilità per personalizzare stile e dimensione.

## Importazione

```tsx
import MyIcon from '@/components/atoms/MyIcon';
```

---

## Tipi supportati

I nomi delle icone supportati sono definiti dal tipo `IconName` e dalla mappa
`iconMap`:

```ts
export const iconMap = {
  'message-square': MessageSquare,
  'file-text': FileText,
  'cog': Cog,
  'check-circle': CheckCircle,
  'code': Code,
  'palette': Palette,
  'database': Database,
  'globe': Globe,
  'trending-up': TrendingUp,
  'target': Target,
  'users': Users,
  'lightbulb': Lightbulb,
  'award': Award,
  'network': Network,
  'megaphone': Megaphone,
  'home': Home,
  'building2': Building2,
  'user-plus': UserPlus,
  'briefcase': Briefcase,
  'message-circle-question': MessageCircleQuestion,
} as const;
```

---

## Utilizzo base

```tsx
<MyIcon name="globe" />
<MyIcon name="code" className="h-6 w-6 text-primary" />
```

N.B.: ATTENZIONE, può essere difficile sovrascrivere il colore di un'icona, in
quanto il colore di default è impostato a `text-primary-foreground`, di
conseguenze specificare il colore potrebbe non funzionare come previsto. La
soluzione migliore è usare classi CSS come `text-[var(--primary)]` o
`text-[var(--secondary)]` per garantire la corretta applicazione del colore.

---

## Props

| Prop        | Tipo                      | Descrizione                                | Default          |
| ----------- | ------------------------- | ------------------------------------------ | ---------------- |
| `name`      | `IconName`                | Nome dell’icona da visualizzare            | **Obbligatorio** |
| `className` | `string`                  | Classi CSS aggiuntive per stile/dimensione | `""`             |
| ...rest     | `SVGProps<SVGSVGElement>` | Qualsiasi altro prop SVG supportato        |                  |

---

## Gestione nomi validi

Per garantire la sicurezza, puoi usare la funzione `isIconName` per validare
stringhe dinamiche:

```tsx
import { isIconName } from '@/components/atoms/MyIcon/icon.list';

const icon = isIconName(userInput) ? userInput : 'database';
<MyIcon name={icon} />;
```

---

## Esempi avanzati

### Dimensione e colore personalizzati

```tsx
<MyIcon name="palette" className="h-10 w-10 text-pink-500" />
```

### Uso in una lista dinamica

**Best practice:**  
Se hai una lista di oggetti con proprietà `icon` di tipo `string`, usa sempre il
controllo con `isIconName` per evitare errori di tipo e runtime:

```tsx
import { isIconName } from '@/components/atoms/MyIcon/icon.list';

const items = [
  { icon: 'code', label: 'Sviluppo' },
  { icon: 'globe', label: 'Internazionale' },
  { icon: 'banana', label: 'Non valida' }, // esempio di valore non valido
];

{
  items.map((item) => (
    <MyIcon
      key={item.icon}
      name={isIconName(item.icon) ? item.icon : 'database'}
    />
  ));
}
```

Una soluzione ancor migliore è tipizzare l'array di oggetti:

```tsx
  const CTAlist: CTA[] = [
    { text: "Resto", link: "/calculator", icon: "calculator" },
    { text: "Guide", link: "/guides", icon: "book" },
    { text: "Contattaci", link: "/contact", icon: "mail" },    
  ];
```
Dove in `CTA` il campo `icon` è di tipo `IconName`:

```ts
export interface CTA {
    /** Testo del pulsante CTA */
    text: string;
    
    /** Link del pulsante CTA */
    link: string;

    /** Icona opzionale per il pulsante */
    icon?: IconName;
    
    /** Classe CSS aggiuntiva per il pulsante */
    className?: string;
    }
```


> **Nota:**  
> Un'alternativa meno sicura è usare la type assertion:  
> `<MyIcon name={item.icon as IconName} />`  
> Tuttavia, questa soluzione non protegge da errori runtime se il valore non è
> valido.

### Validazione input esterno

```tsx
const safeIcon = isIconName(apiIcon) ? apiIcon : 'check-circle';
<MyIcon name={safeIcon} />;
```

---

## Estensione

Puoi estendere la mappa `iconMap` e il tipo `IconName` aggiungendo nuove icone
Lucide:

```ts
// icon.list.ts
import { Star } from 'lucide-react';

export const iconMap = {
  ...,
  'star': Star,
} as const;

export type IconName = keyof typeof iconMap;
```

## Problemi comuni: Sovrascrittura del colore dell'icona

Durante l'utilizzo della componente `MyIcon`, può capitare che la classe CSS
passata tramite la prop `className` non venga applicata correttamente al colore
dell'icona.  
Ad esempio, classi come `text-primary` potrebbero non avere effetto, mentre
classi come `text-black` o `text-secondary` funzionano come previsto.

### Perché succede?

- La classe di default `text-primary-foreground` viene sempre aggiunta
  all'icona, e può sovrascrivere la classe passata tramite `className`.
- Se la variabile CSS associata (`--primary-foreground`) non è definita o non è
  visibile nel contesto, il colore non viene applicato.
- Le classi statiche di Tailwind (`text-black`, `text-red-500`, ecc.) funzionano
  sempre perché sono gestite direttamente da Tailwind.

### Soluzione adottata

Abbiamo modificato la logica di concatenazione delle classi nel componente
`MyIcon` per dare priorità alla classe passata tramite la prop `className`.  
Ora la classe di default viene usata **solo** se non viene specificata una
classe personalizzata:

```tsx
const finalClassName =
  `h-6 w-6 ${className || 'text-primary-foreground'}`.trim();
```

In questo modo, se passi una classe come `text-primary`, sarà quella ad essere
applicata all'icona.  
Se non passi nulla, verrà usata la classe di default.

---

## Best practices

- **Tipizza sempre i dati:** Usa `IconName` nelle interfacce interne.
- **Valida input esterni:** Usa `isIconName` per dati che arrivano da API o
  input utente.
- **Personalizza con className:** Per dimensione, colore e animazioni.
- **Non duplicare icone:** Usa la mappa centralizzata per coerenza.

---
