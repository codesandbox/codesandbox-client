import React from 'react';

const useScrollTop = () => {
  const ref = React.useRef(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  React.useEffect(() => {
    const element = ref.current;

    const handleScroll = (event: React.UIEvent<HTMLElement>) => {
      setScrollTop(event.currentTarget.scrollTop);
    };

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return { scrollTop, ref };
};

export { useScrollTop };
