import React from 'react';
import { Container, Content } from './elements';
import { HarzardButtonProps } from './types';

export const HazardButton = ({
  type = 'button',
  title = '',
  color,
  hover,
  onClick,
  children,
  ...props
}: HarzardButtonProps) => (
  <Container
    type={type}
    title={title}
    onClick={onClick}
    color={color}
    {...props}
  >
    <Content hover={hover}>{children}</Content>
  </Container>
);
