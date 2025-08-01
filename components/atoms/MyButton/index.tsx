import React, { FC } from 'react';

import MyIcon from '@/components/atoms/MyIcon';
import { IconName } from '@/components/atoms/MyIcon/index.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import MyButtonProps from './index.types';

/**
 * MyButton - Componente button versatile con icona integrata
 *
 * Features:
 * - Basato su shadcn Button con tutte le sue varianti
 * - Supporto per icone tramite MyIcon
 * - Posizionamento icona (sinistra/destra)
 * - Modalità icon-only
 * - Loading state integrato
 * - TypeScript completo
 *
 * @param children - Testo del button
 * @param icon - Nome dell'icona da MyIcon
 * @param iconPosition - Posizione dell'icona
 * @param iconOnly - Se mostrare solo l'icona
 * @param loading - Se il button è in loading
 * @param loadingText - Testo durante loading
 * @param iconClassName - Classe CSS per l'icona
 * @param disabled - Se il button è disabilitato
 * @param variant - Variante del button (da shadcn)
 * @param size - Dimensione del button (da shadcn)
 * @param className - Classi CSS aggiuntive
 */
const MyButton: FC<MyButtonProps> = ({
  children,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  loading = false,
  loadingText,
  iconClassName,
  disabled,
  variant = 'default',
  size = 'default',
  className,
  ...props
}) => {
  // Determina se il button è effettivamente disabilitato
  const isDisabled = disabled || loading;

  // Determina il testo da mostrare
  const displayText = loading && loadingText ? loadingText : children;

  // Determina l'icona da mostrare
  const displayIcon: IconName | undefined = loading ? 'loader-2' : icon;

  // Classi per l'icona
  const iconClasses = cn('h-4 w-4', loading && 'animate-spin', iconClassName);

  // Se è icon-only, usa la size "icon" di shadcn
  const buttonSize = iconOnly ? 'icon' : size;

  return (
    <Button
      variant={variant}
      size={buttonSize}
      disabled={isDisabled}
      className={className}
      {...props}
    >
      {/* Icona a sinistra o loading */}
      {displayIcon && (iconPosition === 'left' || iconOnly || loading) && (
        <MyIcon name={displayIcon} className={iconClasses} />
      )}

      {/* Testo del button (se non è icon-only) */}
      {!iconOnly && <span>{displayText}</span>}

      {/* Icona a destra (solo se non è loading e non icon-only) */}
      {displayIcon && iconPosition === 'right' && !iconOnly && !loading && (
        <MyIcon name={displayIcon} className={iconClasses} />
      )}
    </Button>
  );
};

export default MyButton;
