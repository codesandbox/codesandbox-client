import React from 'react';

import { Cube, Sides, Side } from './elements';

function CubeComponent({ size = 150, noAnimation, className }) {
  return (
    <Cube className={className} size={size}>
      <Sides noAnimation={noAnimation} size={size}>
        <Side rotate="rotateX(90deg)" size={size} />
        <Side rotate="rotateX(-90deg)" size={size} />
        <Side rotate="rotateY(0deg)" size={size} />
        <Side rotate="rotateY(-180deg)" size={size} />
        <Side rotate="rotateY(-90deg)" size={size} />
        <Side rotate="rotateY(90deg)" size={size} />
      </Sides>
    </Cube>
  );
}

export default CubeComponent;
