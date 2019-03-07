import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import Tippy from '@tippy.js/react';
import theme from '../theme';

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

const Tooltip = ({ children, ...props }) => (
  <React.Fragment>
    <GlobalStyle />
    <Tippy
      delay={1000}
      content={props.content}
      placement={props.placement || 'top'}
      isEnabled={props.isEnabled}
    >
      <span {...props}>{children}</span>
    </Tippy>
  </React.Fragment>
);
export default Tooltip;
