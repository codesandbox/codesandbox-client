import React from 'react';
import { Badge } from './Badge';

// TODO: Drop in favor of standardized Badge instances
export const CloudBetaBadge: React.FC<{ hideIcon?: boolean }> = ({
  hideIcon,
}) => <Badge icon={hideIcon ? undefined : 'cloud'}>Beta</Badge>;
