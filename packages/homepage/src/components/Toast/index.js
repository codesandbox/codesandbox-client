import React, { useState, useEffect } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Link } from 'gatsby';
import { AnimatePresence } from 'framer-motion';

import { ToastContainer } from './elements';

const key = 'ACCEPTED_TERMS_CODESANDBOX_v1.1';
const Privacy = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = Boolean(window.localStorage.getItem(key));
    if (!hasSeen) {
      setShow(true);
      window.localStorage.setItem(key, true);

      track('Saw Terms of Use Notification');
    }
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
            aria-label="Close"
            onClick={() => setShow(false)}
          />
        </ToastContainer>
      ) : null}
    </AnimatePresence>
  );
};

export default Privacy;
