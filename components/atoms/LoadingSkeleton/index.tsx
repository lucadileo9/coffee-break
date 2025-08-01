import React, { FC } from 'react';

import { cn } from '@/lib/utils';

import LoadingSkeletonProps from './index.types';

const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  className,
  lines = 3,
}) => {
  return (
    <div className={cn('animate-pulse rounded-lg bg-card p-6', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'mb-2 h-3 rounded bg-muted',
            i === 0 && 'mb-4 h-4', // Prima riga più grande (titolo)
            i === lines - 1 && 'w-2/3' // Ultima riga più corta
          )}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
