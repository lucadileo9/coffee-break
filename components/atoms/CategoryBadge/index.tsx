import React, { FC } from 'react';

import { cn } from '@/lib/utils';

import CategoryBadgeProps from './index.types';

const CategoryBadge: FC<CategoryBadgeProps> = ({ name, variant }) => {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2 py-1 text-xs',
        variant === 'default'
          ? 'bg-primary/10 text-primary'
          : 'border border-primary text-primary'
      )}
    >
      {name}
    </span>
  );
};

export default CategoryBadge;
