import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from 'styled-components';

import theme from '@codesandbox/common/lib/theme';
import { createGlobalStyle } from 'styled-components';

import global from '@codesandbox/common/lib/global.css';
import font from './assets/inter/inter.css';

const GlobalStyle = createGlobalStyle`
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

const Main = () => (
  <ThemeProvider theme={theme}>
    <>
      <GlobalStyle />
      <App />
    </>
  </ThemeProvider>
);

ReactDOM.render(<Main />, document.getElementById('root'));
