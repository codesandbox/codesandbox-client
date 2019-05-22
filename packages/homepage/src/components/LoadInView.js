import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import getScrollPos from '../utils/scroll';

const LoadInView = ({ children, style, ...props }) => {
  const [show, setShow] = useState(false);
  const el = useRef(null);
  const elPos = useRef(null);

  useEffect(() => {
    elPos.current = el.current.getBoundingClientRect().top;
  }, []);

  const listenFn = useCallback(() => {
    if (!show && elPos.current && getScrollPos().y + 600 > elPos.current) {
      requestAnimationFrame(() => {
        setShow(true);
      });
    }
  }, [show]);

  useEffect(() => {
    const listen = debounce(listenFn, 50);

    window.addEventListener('scroll', listen);

    return () => window.removeEventListener('scroll', listen);
  }, [listenFn]);

  return (
    <div
      ref={el}
      style={{ display: 'inline-block', width: '100%', ...style }}
      {...props}
    >
      {show && children}
    </div>
  );
};

export default LoadInView;
