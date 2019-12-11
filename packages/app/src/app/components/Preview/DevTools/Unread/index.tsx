import React from 'react';

import { Container } from './elements';
import { StatusType } from '..';

export type Props = {
  status: StatusType;
  unread: number;
};

export function Unread({ status, unread }: Props) {
  return (
    <Container unread={unread} status={status}>
      {unread}
    </Container>
  );
}
