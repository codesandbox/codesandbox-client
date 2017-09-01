import React from 'react';
import Badge from './Badge';

const DEFAULT_BADGE = {
  id: 'patron_1',
  name: 'Patron I',
  visible: true,
};

export default ({ size, ...props }: { size: number }) => (
  <Badge {...props} badge={DEFAULT_BADGE} size={size} />
);
