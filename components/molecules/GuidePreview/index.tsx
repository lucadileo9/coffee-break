import React, { FC } from 'react';

import CategoryBadge from '@/components/atoms/CategoryBadge';
import DateBadge from '@/components/atoms/DateBadge';

import GuidePreviewProps from './index.types';

const GuidePreview: FC<GuidePreviewProps> = ({ guide, onClick }) => {
  return (
    <div
      className="cursor-pointer rounded-lg bg-card p-6 transition-shadow hover:shadow-lg"
      onClick={onClick}
    >
      <div className="mb-4">
        {guide.categories && (
          <div className="mb-2">
            <CategoryBadge name={guide.categories.name} />
          </div>
        )}
        <h3 className="mb-2 text-lg font-semibold">{guide.title}</h3>
      </div>

      <div className="flex items-center justify-between">
        <DateBadge date={guide.created_at} />
        <span className="text-sm font-medium text-primary hover:underline">
          Leggi →
        </span>
      </div>
    </div>
  );
};

export default GuidePreview;
