import { IconName } from '@/components/atoms/MyIcon/index.types';

// Props per il componente QuickActionCard
export default interface QuickActionCardProps {
  title: string; // Titolo dell'azione (es. "Nuova Guida")
  description: string; // Descrizione breve dell'azione (es. "Crea una nuova guida")
  href: string; // URL di destinazione dell'azione
  icon: IconName; // Nome dell'icona MyIcon (es. "plus", "book", "eye")
  external?: boolean; // Se true, il link si apre in una nuova tab (per link esterni)
  className?: string; // Classi CSS aggiuntive
}

// Configurazione predefinita per azioni comuni
// Può essere utilizzata per standardizzare le azioni più frequenti
export interface QuickActionConfig {
  id: string; // Identificatore unico dell'azione
  cardProps: QuickActionCardProps; // Props per il QuickActionCard
  category?: 'content' | 'management' | 'system' | 'external'; // Categoria dell'azione (per raggruppamenti futuri)
  requiresAdmin?: boolean; // Se l'azione richiede permessi admin
}
