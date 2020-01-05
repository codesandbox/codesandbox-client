import React from 'react';
import styled from 'styled-components';
import Tippy, { useSingleton } from '@tippy.js/react';
import { animateFill, Props } from 'tippy.js';
import theme from '../../theme';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css';

const defaultProps: Partial<Props> = {
  delay: [500, 100],
  boundary: 'window',
  animateFill: true,
  plugins: [animateFill],
};

const mainStyles = `
  background-color: rgb(21, 24, 25);

  .tippy-backdrop {
    background-color: rgb(21, 24, 25);
  }
`;

const MainTippy = styled(Tippy)`
  ${mainStyles}
`;

const UpdateTippy = styled(Tippy)`
  background-color: ${theme.green()};
  border-radius: 2px;
  padding: 0;

  .tippy-arrow {
    border-bottom-color: ${theme.green()};
  }
`;

export const SingletonTooltip = styled(
  ({ children, style = {}, content, ...props }) => {
    const singleton = useSingleton({
      ...defaultProps,
      updateDuration: 250,
      ...props,
    });

    return children(singleton);
  }
)`
  ${mainStyles}
`;

const Tooltip = ({ children, style = {}, content, ...props }) => {
  const TippyComponent = props.theme === 'update' ? UpdateTippy : MainTippy;

  return (
    <TippyComponent content={content} {...defaultProps} {...props}>
      <span
        style={{
          outlineColor: 'transparent',
          ...style,
        }}
      >
        {children}
      </span>
    </TippyComponent>
  );
};

export default Tooltip;
