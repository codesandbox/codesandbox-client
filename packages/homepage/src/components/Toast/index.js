import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

import { Toastcontainer } from './elements';

export const Privacy: FunctionComponent = () => (
  <Toastcontainer>
    By using our site you agree with our{' '}
    <Link to="/legal/privacy">Privacy Policy</Link>
    <span>close</span>
  </Toastcontainer>
);

export default Privacy;
