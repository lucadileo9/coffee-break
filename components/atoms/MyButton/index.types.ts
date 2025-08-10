import { IconName } from '@/components/atoms/MyIcon/index.types';
import { ButtonProps } from '@/components/ui/button';

export default interface MyButtonProps extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode; // Testo del button
  icon?: IconName; // Nome dell'icona da MyIcon
  iconPosition?: 'left' | 'right'; // Posizione dell'icona
  iconOnly?: boolean; // Se mostrare solo l'icona
  loading?: boolean; // Se il button è in stato di loading
  loadingText?: string; // Testo durante loading
  iconClassName?: string; // Classe CSS per l'icona
}
