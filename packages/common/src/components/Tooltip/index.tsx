import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Tippy from '@tippy.js/react';
import theme from '../../theme';

const GlobalStyle = createGlobalStyle`
  .tippy-backdrop {
    background-color: rgb(21, 24, 25);
  }

  .tippy-tooltip.update-theme {
    background-color: ${theme.green()};
    border-radius: 2px;
    padding: 0;

    .tippy-arrow {
      border-bottom-color: ${theme.green()};
    }
  }
`;

const Tooltip = ({ children, style = {}, content, ...props }) => (
  <React.Fragment>
    <GlobalStyle />
    <Tippy delay={[500, 0]} content={content} {...props}>
      <span
        style={{
          outlineColor: 'transparent',
          ...style,
        }}
      >
        {children}
      </span>
    </Tippy>
  </React.Fragment>
);

export default Tooltip;
