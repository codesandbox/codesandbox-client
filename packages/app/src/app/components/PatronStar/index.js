import React from 'react';
import moment from 'moment';
import StarIcon from 'react-icons/lib/go/star';

import { Container } from './elements';

function PatronStar({ subscriptionSince, ...props }) {
  return (
    <Container
      title={`Patron since ${moment(subscriptionSince).format('MMM Y')}`}
    >
      <StarIcon {...props} />
    </Container>
  );
}

export default PatronStar;
