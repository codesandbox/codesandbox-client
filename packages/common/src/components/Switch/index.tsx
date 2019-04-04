import * as React from 'react';

import { Container, Dot } from './elements';

export type Props = {
  right: boolean;
  onClick: () => void;
  secondary: boolean;
  offMode: boolean;
  small: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function Switch({
  right,
  onClick,
  secondary = false,
  offMode = false,
  small = false,
  className,
  style,
}: Props) {
  return (
    <Container
      style={style}
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
