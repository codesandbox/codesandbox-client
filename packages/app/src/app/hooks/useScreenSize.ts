import { useState, useLayoutEffect } from 'react';

export function useScreenSize() {
  const [size, setSize] = useState({
    width: null,
    height: null,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}
