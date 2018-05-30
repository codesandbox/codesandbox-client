import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  border: 1px solid ${props => props.theme.secondary};
  background-color: ${props => props.theme.secondary.clearer(0.5)};
  pointer-events: none;
`;

export function getBounds(startX, startY, endX, endY) {
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
}

const Selection = ({ startX, startY, endX, endY }) => {
  const { top, height, left, width } = getBounds(startX, startY, endX, endY);

  return <Container style={{ top, width, left, height }} />;
};

export default Selection;
