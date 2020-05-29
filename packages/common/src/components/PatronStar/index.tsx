import { format } from 'date-fns';
import React, { FunctionComponent } from 'react';
import { GoStar } from 'react-icons/go';

import Tooltip from '../Tooltip';
import { Container } from './elements';

type Props = {
  style?: React.CSSProperties;
  subscriptionSince: string | number | Date;
};

export const PatronStar: FunctionComponent<Props> = ({
  subscriptionSince,
  ...props
}) => (
  <Tooltip
    content={`Patron since ${format(new Date(subscriptionSince), 'MMM yyyy')}`}
  >
    <Container>
      <GoStar {...props} />
    </Container>
  </Tooltip>
);
