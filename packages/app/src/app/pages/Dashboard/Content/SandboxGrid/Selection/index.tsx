import React, { FunctionComponent } from 'react';
import { Spring } from 'react-spring/renderprops';

import { Container } from './elements';

export const getBounds = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  const top = startY > endY ? endY : startY;
  const left = startX > endX ? endX : startX;
  const width = startX > endX ? startX - endX : endX - startX;
  const height = startY > endY ? startY - endY : endY - startY;

  return {
    top,
    height,
    left,
    width,
  };
};

type Props = {
  endX: number;
  endY: number;
  startX: number;
  startY: number;
};
export const Selection: FunctionComponent<Props> = ({
  endX,
  endY,
  startX,
  startY,
}) => {
  const { top, height, left, width } = getBounds(startX, startY, endX, endY);

  return (
    <Spring native immediate to={{ top, height, left, width }}>
      {style => <Container style={style} />}
    </Spring>
  );
};
