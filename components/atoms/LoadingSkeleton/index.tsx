import React, { FC } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import LoadingSkeletonProps from './index.types';

const DEFAULT_LINES = 3;

const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  className,
  lines = DEFAULT_LINES,
  variant = 'default',
  count = 1,
}) => {
  const skeletonClass = 'animate-pulse bg-muted rounded';

  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return (
          <div className={cn('space-y-3', className)}>
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 rounded-lg border p-4"
              >
                <div className={`${skeletonClass} h-4 flex-1`}></div>
                <div className={`${skeletonClass} h-8 w-20`}></div>
                <div className={`${skeletonClass} h-8 w-20`}></div>
              </div>
            ))}
          </div>
        );

      case 'form':
        return (
          <div className={cn('space-y-6', className)}>
            <div className="space-y-2">
              <div className={`${skeletonClass} h-4 w-24`}></div>
              <div className={`${skeletonClass} h-10 w-full`}></div>
            </div>
            <div className="space-y-2">
              <div className={`${skeletonClass} h-4 w-32`}></div>
              <div className={`${skeletonClass} h-10 w-full`}></div>
            </div>
            <div className="space-y-2">
              <div className={`${skeletonClass} h-4 w-28`}></div>
              <div className={`${skeletonClass} h-32 w-full`}></div>
            </div>
            <div className={`${skeletonClass} ml-auto h-10 w-32`}></div>
          </div>
        );

      case 'card':
        return (
          <div className={className}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  <span className="ml-2">Caricamento...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'default':
      default:
        return (
          <div
            className={cn('animate-pulse rounded-lg bg-card p-6', className)}
          >
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
    }
  };

  return renderSkeleton();
};

export default LoadingSkeleton;
