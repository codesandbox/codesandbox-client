import React from 'react';
import { Container, Sides, Side } from './elements';

interface ICubeComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const Cube: React.FC<ICubeComponentProps> = ({
  size = 150,
  ...props
}) => (
  <Container size={size} {...props}>
    <Sides size={size}>
      <Side rotate="rotateX(90deg)" size={size} />
      <Side rotate="rotateX(-90deg)" size={size} />
      <Side rotate="rotateY(0deg)" size={size} />
      <Side rotate="rotateY(-180deg)" size={size} />
      <Side rotate="rotateY(-90deg)" size={size} />
      <Side rotate="rotateY(90deg)" size={size} />
    </Sides>
  </Container>
);
