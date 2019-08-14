import { createGlobalStyle } from 'styled-components';

import global from '@codesandbox/common/lib/global.css';
import font from './assets/inter/inter.css';

export const GlobalStyle = createGlobalStyle`
  ${font}
  ${global}

  html,body, #root {
    height: 100%;
    a {
      color: ${props => props.theme.white};
      text-decoration: none;
    }
  }



  html, body {
   font-family: 'Inter' !important;
  }
`;
