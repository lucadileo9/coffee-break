import { type LucideProps } from 'lucide-react';

import { iconMap } from './icon.list';

// Deriva un tipo unione con tutte le chiavi della nostra mappa.
export type IconName = keyof typeof iconMap;

// Definiamo le props del componente, usando il tipo appena creato.
export interface MyIconProps extends LucideProps {
  name: IconName;
  className?: string;
}
