import React from 'react';
import moment from 'moment';
import StarIcon from 'react-icons/lib/go/star';

import { Container } from './elements';

interface PatronStarProps {
  subscriptionSince: string;
  style?: React.CSSProperties;
}

export function PatronStar({ subscriptionSince, ...props }: PatronStarProps) {
  return (
    <Container
      title={`Patron since ${moment(subscriptionSince).format('MMM Y')}`}
    >
      <StarIcon {...props} />
    </Container>
  );
}
