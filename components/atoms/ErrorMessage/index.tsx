import React, { FC } from 'react';

import MyButton from '@/components/atoms/MyButton';
import MyIcon from '@/components/atoms/MyIcon';
import { IconName } from '@/components/atoms/MyIcon/index.types';
import { cn } from '@/lib/utils';

import ErrorMessageProps from './index.types';

/**
 * ErrorMessage - Componente per visualizzare messaggi di errore
 *
 * Features:
 * - Diversi variant (error, warning, info)
 * - Icone appropriate per tipo
 * - Supporto per retry action
 * - Design responsive
 * - Accessibilità integrata
 *
 * @param message - Messaggio di errore principale
 * @param title - Titolo dell'errore
 * @param details - Dettagli aggiuntivi
 * @param variant - Tipo di errore per styling
 * @param showIcon - Se mostrare l'icona
 * @param onRetry - Callback per retry
 * @param retryText - Testo del button retry
 * @param className - Classi CSS aggiuntive
 */
const ErrorMessage: FC<ErrorMessageProps> = ({
  message,
  title = 'Errore',
  details,
  variant = 'error',
  showIcon = true,
  onRetry,
  retryText = 'Riprova',
  className = '',
}) => {
  // Configurazione per ogni variant
  const variantConfig = {
    error: {
      iconName: 'alert-circle' as IconName,
      containerClass:
        'border-destructive/20 bg-destructive/10 text-destructive',
      iconClass: 'text-destructive',
      titleClass: 'text-destructive',
    },
    warning: {
      iconName: 'alert-triangle' as IconName,
      containerClass:
        'border-yellow-500/20 bg-yellow-500/10 text-yellow-800 dark:text-yellow-200',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      titleClass: 'text-yellow-800 dark:text-yellow-200',
    },
    info: {
      iconName: 'info' as IconName,
      containerClass:
        'border-blue-500/20 bg-blue-500/10 text-blue-800 dark:text-blue-200',
      iconClass: 'text-blue-600 dark:text-blue-400',
      titleClass: 'text-blue-800 dark:text-blue-200',
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={cn('rounded-lg border p-6', config.containerClass, className)}
      role="alert"
      aria-live="polite"
    >
      <div className="flex">
        {/* Icona */}
        {showIcon && (
          <div className="flex-shrink-0">
            <MyIcon
              name={config.iconName}
              className={cn('h-5 w-5', config.iconClass)}
            />
          </div>
        )}

        {/* Contenuto */}
        <div className={cn('ml-3', !showIcon && 'ml-0')}>
          {/* Titolo */}
          <h3 className={cn('mb-2 text-lg font-semibold', config.titleClass)}>
            {title}
          </h3>

          {/* Messaggio principale */}
          <p className="mb-2 leading-relaxed">{message}</p>

          {/* Dettagli aggiuntivi */}
          {details && <p className="mb-4 text-sm opacity-80">{details}</p>}

          {/* Button di retry */}
          {onRetry && (
            <MyButton
              icon="refresh-cw"
              onClick={onRetry}
              variant={variant === 'error' ? 'destructive' : 'default'}
              size="sm"
              className={cn(
                variant === 'warning' &&
                  'bg-yellow-600 text-white hover:bg-yellow-700',
                variant === 'info' && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {retryText}
            </MyButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
