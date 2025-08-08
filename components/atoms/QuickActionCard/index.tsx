import Link from 'next/link';
import React from 'react';

import MyIcon from '@/components/atoms/MyIcon';
import { Button } from '@/components/ui/button';

import type QuickActionCardProps from './index.types';

/**
 * QuickActionCard - Componente atomico per azioni rapide
 *
 * Features:
 * - Design consistente per tutte le azioni rapide
 * - Supporta link interni ed esterni
 * - Icone MyIcon personalizzabili
 * - Completamente riutilizzabile
 */
export default function QuickActionCard({
  title,
  description,
  href,
  icon,
  external = false,
  className = '',
}: QuickActionCardProps) {
  const buttonContent = (
    <>
      <MyIcon name={icon} className="h-5 w-5" />
      <div className="text-center">
        <div className="font-semibold">{title}</div>
        <div className="text-xs opacity-70">{description}</div>
      </div>
    </>
  );

  const buttonProps = {
    variant: 'outline' as const,
    className: `h-20 flex-col gap-2 ${className}`,
  };

  // Se è un link esterno, usa un tag <a> normale
  if (external) {
    return (
      <Button {...buttonProps} asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {buttonContent}
        </a>
      </Button>
    );
  }

  // Per link interni, usa Next.js Link
  return (
    <Button {...buttonProps} asChild>
      <Link href={href}>{buttonContent}</Link>
    </Button>
  );
}
