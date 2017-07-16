import React from 'react';
import Badge from './Badge';

const DEFAULT_BADGE = {
  id: 'patron_diamond',
  name: 'Diamond Patron',
};

export default ({ size }: { size: number }) =>
  <Badge badge={DEFAULT_BADGE} size={size} />;
