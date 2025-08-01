import React, { FC } from 'react';

import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import GuidePreview from '@/components/molecules/GuidePreview';

import GuideListProps from './index.types';

const GuideList: FC<GuideListProps> = ({
  guides,
  loading = false,
  onGuideClick,
  emptyMessage = 'Nessuna guida disponibile.',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-20" />
        ))}
      </div>
    );
  }
  if (guides.length === 0) {
    return (
      <div className="text-center text-muted-foreground">{emptyMessage}</div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {guides.map((guide) => (
        <GuidePreview
          key={guide.id}
          guide={guide}
          onClick={() => onGuideClick(guide.id)}
        />
      ))}
    </div>
  );
};

export default GuideList;
