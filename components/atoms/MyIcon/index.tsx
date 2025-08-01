import React, { FC } from 'react';

import { iconMap } from './icon.list';
import { MyIconProps } from './index.types';

const MyIcon: FC<MyIconProps> = ({ name, className, ...props }) => {
  // Cerca il componente nella mappa importata
  const IconComponent = iconMap[name];

  // Grazie a TypeScript, 'name' può essere solo una delle chiavi valide,
  // quindi un controllo di esistenza è una sicurezza aggiuntiva per il runtime.
  if (!IconComponent) {
    return null;
  }

  // Combina le classi di default con quelle passate come props
  const finalClassName =
    `h-6 w-6 ${className || 'text-primary-foreground'}`.trim();
  return <IconComponent className={finalClassName.trim()} {...props} />;
};

export default MyIcon;
