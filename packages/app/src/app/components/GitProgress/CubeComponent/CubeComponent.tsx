import React from 'react';
import { Cube, Sides, Side } from './elements';

interface ICubeComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const CubeComponent: React.FC<ICubeComponentProps> = ({
  size = 150,
  className,
}) => (
  <Cube className={className} size={size}>
    <Sides size={size}>
      <Side rotate="rotateX(90deg)" size={size} />
      <Side rotate="rotateX(-90deg)" size={size} />
      <Side rotate="rotateY(0deg)" size={size} />
      <Side rotate="rotateY(-180deg)" size={size} />
      <Side rotate="rotateY(-90deg)" size={size} />
      <Side rotate="rotateY(90deg)" size={size} />
    </Sides>
  </Cube>
);
