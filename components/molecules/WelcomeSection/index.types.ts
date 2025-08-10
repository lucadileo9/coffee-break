import { CTA } from '@/types/cta';

/**
 * Props per WelcomeSection
 */
export default interface WelcomeSectionProps {
  /** Titolo principale della sezione welcome */
  title?: string;
  /** Sottotitolo/descrizione */
  subtitle?: string;
  /** Descrizione estesa (opzionale) */
  description?: string;
  /** Mostra pulsante CTA (default: true) */
  showCTA?: boolean;

  CTAlist?: CTA[];
  /** Classe CSS aggiuntiva */
  className?: string;
}
