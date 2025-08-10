import React, { FC } from 'react';

import { cn } from '@/lib/utils';

import SimpleTitleProps from './index.types';

/**
 * SimpleTitle - Componente per titoli semplici e versatili
 *
 * Features:
 * - Supporta tutti i livelli di heading (h1-h6)
 * - Stili predefiniti responsivi
 * - Supporto per classi personalizzate
 * - Accessibilità integrata
 *
 * @param children - Contenuto del titolo
 * @param level - Livello del heading (default: h1)
 * @param className - Classi CSS aggiuntive
 * @param id - ID per accessibilità
 */
const SimpleTitle: FC<SimpleTitleProps> = ({
  children,
  level = 'h1',
  className = '',
  id,
}) => {
  // Classi base per ogni livello di titolo
  const baseStyles = {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    h4: 'text-xl md:text-2xl lg:text-3xl font-medium',
    h5: 'text-lg md:text-xl lg:text-2xl font-medium',
    h6: 'text-base md:text-lg lg:text-xl font-medium',
  };

  // Classi comuni per tutti i titoli
  const commonStyles = 'text-foreground leading-tight';

  // Combinazione delle classi
  const titleStyles = cn(baseStyles[level], commonStyles, className);

  // Rendering condizionale del tag appropriato
  const TitleTag = level as keyof JSX.IntrinsicElements;

  return (
    <TitleTag id={id} className={titleStyles}>
      {children}
    </TitleTag>
  );
};

export default SimpleTitle;
