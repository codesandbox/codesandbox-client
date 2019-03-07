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

const Tooltip = ({ children, style = {}, ...props }) => (
  <React.Fragment>
    <GlobalStyle />
    <Tippy {...props}>
      <div
        style={{
          height: '100%',
          width: '100%',
          ...style,
        }}
      >
        {children}
      </div>
    </Tippy>
  </React.Fragment>
);
export default Tooltip;
