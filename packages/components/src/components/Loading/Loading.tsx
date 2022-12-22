import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Element } from '../Element';

const VIEWBOX_SIZE = 100;
const VIEWBOX = `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`;
const BASE_DURATION = 1.2;
const COLORS = 4;
const COLOR_DURATION = BASE_DURATION * COLORS;
const BOX_START = 0;
const BOX_END = VIEWBOX_SIZE;
const STROKE = 15;
const BASE_UNIT = 4;

type Coordinate = [number, number];
type Points = Coordinate[];

type CornerName = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

const toPoint = (point: Coordinate): string => `${point[0]}, ${point[1]}`;
const toPoints = (points: Points): string => points.map(toPoint).join(', ');

const corner: Record<CornerName, Coordinate> = {
  topLeft: [BOX_START, BOX_START],
  topRight: [BOX_END, BOX_START],
  bottomLeft: [BOX_START, BOX_END],
  bottomRight: [BOX_END, BOX_END],
};

const TOP_RIGHT_CORNER_POINTS = toPoints([
  corner.topLeft,
  corner.topRight,
  corner.bottomRight,
]);

const BOTTOM_LEFT_CORNER_POINTS = toPoints([
  corner.topLeft,
  corner.bottomLeft,
  corner.bottomRight,
]);

const spacing = keyframes({
  '0%': {
    strokeDasharray: '0 200',
  },
  '45%': {
    strokeDashoffset: '0',
    strokeDasharray: '200 200',
  },
  '90%': {
    strokeDashoffset: '-200',
    strokeDasharray: '200 200',
  },
  '100%': {
    strokeDashoffset: '-200',
    strokeDasharray: '200 200',
  },
});

const color = keyframes({
  '0%': {
    stroke: '#AC9CFF',
  },
  '24%': {
    stroke: '#AC9CFF',
  },
  '25%': {
    stroke: '#AC9CFF',
  },
  '49%': {
    stroke: '#AC9CFF',
  },
  '50%': {
    stroke: '#ED6C6C',
  },
  '74%': {
    stroke: '#ED6C6C',
  },
  '75%': {
    stroke: '#EE8269',
  },
  '99%': {
    stroke: '#EE8269',
  },
});

const Line = styled.polyline`
  stroke: #4d4d4d;
`;

const AnimatedLine = styled.polyline`
  animation: ${spacing} ${BASE_DURATION}s ease-in,
    ${color} ${COLOR_DURATION}s linear;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: forwards;
  transform-origin: center center;
`;

const Square: React.FC<{ variant: 'animated' | 'still' }> = ({ variant }) => {
  const Component = variant === 'animated' ? AnimatedLine : Line;

  return (
    <>
      <Component
        fill="none"
        points={TOP_RIGHT_CORNER_POINTS}
        strokeWidth={STROKE}
      />
      <Component
        fill="none"
        points={BOTTOM_LEFT_CORNER_POINTS}
        strokeWidth={STROKE}
      />
    </>
  );
};

export const Loading: React.FC<{ size?: number }> = ({ size = 8 }) => {
  const sizeToken = `${size * BASE_UNIT}px`;

  return (
    <Element
      aria-label="Loading"
      as="svg"
      css={{
        width: sizeToken,
        height: sizeToken,
      }}
      role="img"
      viewBox={VIEWBOX}
    >
      <Square variant="still" />
      <Square variant="animated" />
    </Element>
  );
};
