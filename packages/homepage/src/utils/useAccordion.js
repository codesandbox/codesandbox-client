import { useEffect } from 'react';

export const useAccordion = () => {
  useEffect(() => {
    const toggleClasses = e => {
      if (e.target.localName !== 'h2') return;
      const parent = e.target.parentNode;

      e.target.classList.toggle('open');
      Array.from(parent.getElementsByTagName('p')).map(p =>
        p.classList.toggle('show')
      );

      Array.from(parent.getElementsByTagName('ul')).map(p =>
        p.classList.toggle('show')
      );
    };

    document.addEventListener('click', toggleClasses);

    return () => document.removeEventListener('click', toggleClasses);
  }, []);
};
