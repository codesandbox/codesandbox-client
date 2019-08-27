import React from 'react';
import { format } from 'date-fns';
import StarIcon from 'react-icons/lib/go/star';
import Tooltip from '../Tooltip';

import { Container } from './elements';

interface PatronStarProps {
  subscriptionSince: number | Date;
  style?: React.CSSProperties;
}

export function PatronStar({ subscriptionSince, ...props }: PatronStarProps) {
  return (
    <Tooltip
      content={`Patron since ${format(
        new Date(subscriptionSince),
        'MMM yyyy'
      )}`}
    >
      <Container>
        <StarIcon {...props} />
      </Container>
    </Tooltip>
  );
}
