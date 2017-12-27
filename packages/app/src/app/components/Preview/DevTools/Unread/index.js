import React from 'react';

import { Container } from './elements';

function Unread({ status, unread }) {
  return (
    <Container unread={unread} status={status}>
      {unread}
    </Container>
  );
}

export default Unread;
