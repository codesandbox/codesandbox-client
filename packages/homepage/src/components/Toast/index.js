import React from 'react';
import { Link } from 'gatsby';
import { motion } from 'framer-motion';

import { Toastcontainer } from './elements';

const Privacy = () => (
  <motion.div>
    <Toastcontainer>
      By using our site you agree with our{' '}
      <Link to="/legal/privacy">Privacy Policy</Link>
      <span />
    </Toastcontainer>
  </motion.div>
);

export default Privacy;
