import { QuickActionConfig } from '@/components/atoms/QuickActionCard/index.types';

export default interface QuickActionsGridProps {
  title?: string; // Titolo della sezione
  description?: string; // Descrizione della sezione
  actions: QuickActionConfig[]; // Lista delle azioni da mostrare
  className?: string; // Classi CSS aggiuntive per il container
}
