import React from 'react';
import { BrowserRouter, Match } from 'react-router';
import 'normalize.css';

import Root from './Root';
import SandboxEditor from './SandboxEditor/';

export default () => (
  <BrowserRouter>
    <div>
      <Match exactly pattern="/" component={Root} />
      <Match pattern="/sandbox/:sandbox/:module?" component={SandboxEditor} />
    </div>
  </BrowserRouter>
);
