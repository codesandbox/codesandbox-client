/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { AnimatePresence } from 'framer-motion';

import { ToastContainer } from './elements';

const Privacy = () => {
  const key = 'ACCEPTED_TERMS_CODESANDBOX_HOME';
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!window.localStorage.getItem(key));
    window.localStorage.setItem(key, true);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <ToastContainer
          initial={{ y: 0, x: '-50%' }}
          animate={{ y: 0, x: '-50%' }}
          exit={{ y: 200, x: '-50%' }}
          key="toast"
        >
          By using our site you agree with our{' '}
          <Link to="/legal/privacy">Privacy Policy</Link>
          <button
            type="button"
            ariaLabel="Close"
            onClick={() => setShow(false)}
          />
        </ToastContainer>
      ) : null}
    </AnimatePresence>
  );
};

export default Privacy;
