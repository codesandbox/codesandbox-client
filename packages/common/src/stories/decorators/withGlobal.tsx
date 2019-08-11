import React, { Fragment } from 'react';
import { createGlobalStyle } from 'styled-components';

import global from '../../global.css';

const GlobalStyle = createGlobalStyle`
  ${global}
`;

export const withGlobal = cb => (
  <Fragment>
    <GlobalStyle />

    {cb()}
  </Fragment>
);
