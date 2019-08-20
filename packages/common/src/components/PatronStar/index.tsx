import React from 'react';
import { format } from 'date-fns';
import StarIcon from 'react-icons/lib/go/star';
import Tooltip from '../Tooltip';

import { Container } from './elements';

interface PatronStarProps {
  subscriptionSince: string;
  style?: React.CSSProperties;
}

export function PatronStar({ subscriptionSince, ...props }: PatronStarProps) {
  return (
    <Tooltip content={`Patron since ${format(subscriptionSince, 'MMM Y')}`}>
      <Container>
        <StarIcon {...props} />
      </Container>
    </Tooltip>
  );
}
