import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line
const getDirectionTransforms = ({ offset = 0, left, right, bottom, top }) => {
  if (left) {
    return `
      top: -5px;
      right: ${130 + offset}%;
    `;
  }

  if (right) {
    return `
      left: ${130 + offset}%;
      top: -15px;
    `;
  }

  if (top) {
    return `
      left: 50%;
      bottom: ${130 + offset}%;
    `;
  }

  return `
      left: 50%;
      top: ${130 + offset}%;
  `;
};

// eslint-disable-next-line
const getDirectionArrow = ({ theme, left, right, bottom, top }) => {
  if (left) {
    return `
      left: 100%;
      top: 50%;
      margin-top: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent transparent ${theme.background2.darken(0.25)()};
    `;
  }

  if (right) {
    return `
      right: 100%;
      top: 50%;
      margin-top: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent ${theme.background2.darken(0.25)()} transparent transparent;
    `;
  }

  if (top) {
    return `
      top: 100%;
      left: 50%;
      margin-top: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent transparent ${theme.background2.darken(0.25)()};
    `;
  }

  return `
      bottom: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent ${theme.background2.darken(0.25)()} transparent;
  `;
};

const Tooltip = styled.div`
  transition-delay: 0.3s;
  position: relative;
  width: inherit;
  height: inherit;
  display: inherit;
  font-size: inherit;
  flex: inherit;
  box-sizing: border-box;

  .tooltip {
    position: absolute;
    transition: 0.3s ease all;
    color: white;
    opacity: 0;
    visibility: hidden;
    ${getDirectionTransforms}
    box-sizing: border-box;
    margin-left: -4rem;
    padding: 0.5rem;
    z-index: 200;

    background-color: ${props => props.theme.background2.darken(0.25)};

    width: 8rem;
    font-size: .875rem;
    text-align: center;

    &:after {
      content: "";
      position: absolute;
      ${getDirectionArrow}
    }
  }

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

type Props = {
  className: ?string,
  offset: ?number,
  children: React.CElement,
  message: string,
  left: ?boolean,
  right: ?boolean,
  top: ?boolean,
  bottom: ?boolean,
};

export default ({
  className,
  offset = 0,
  children,
  message,
  left,
  right,
  bottom,
  top,
}: Props) => (
  <Tooltip
    className={className}
    bottom={bottom}
    left={left}
    right={right}
    top={top}
    offset={offset}
  >
    {children}
    <span className="tooltip">{message}</span>
  </Tooltip>
);
