import React from 'react';
import { Link } from 'gatsby';

import { Toastcontainer } from './elements';

const Privacy = () => (
  <Toastcontainer>
    By using our site you agree with our{' '}
    <Link to="/legal/privacy">Privacy Policy</Link>
    <span>close</span>
  </Toastcontainer>
);

export default Privacy;
