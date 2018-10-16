import React from 'react';

import { Container, Dot } from './elements';

function Switch({
  right,
  onClick,
  secondary = false,
  offMode = false,
  small = false,
  className,
}) {
  return (
    <Container
      small={small}
      secondary={secondary}
      offMode={offMode}
      onClick={onClick}
      right={right}
      className={className}
    >
      <Dot small={small} right={right} />
    </Container>
  );
}

export default Switch;
