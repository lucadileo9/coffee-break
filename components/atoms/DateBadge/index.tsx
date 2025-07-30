import React, { FC } from 'react';

import DateBadgeProps from './index.types';

const DateBadge: FC<DateBadgeProps> = ({ date, locale = 'it-IT' }) => {
  const formattedDate = new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return <span className="text-xs text-muted-foreground">{formattedDate}</span>;
};

export default DateBadge;
