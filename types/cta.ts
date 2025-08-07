import { IconName } from '@/components/atoms/MyIcon/index.types';

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
