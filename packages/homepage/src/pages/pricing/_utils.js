import { useEffect, useState } from 'react';

/**
 {
   pro | team_pro {
     month | year {
       current: string
       unit_amount: number
     }
   }
 }
 */
export const usePricing = () => {
  const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      const BASE =
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
      const payload = await fetch(`${BASE}/api/v1/prices`).then(x => x.json());

      setData(payload);
    } catch {
      //
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data;
};

export const formatCurrency = ({ currency, unit_amount }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency,
  });
  return formatter.format(unit_amount / 100);
};

// Taken from https://www.joshwcomeau.com/react/prefers-reduced-motion/#the-hook
const QUERY = '(prefers-reduced-motion: no-preference)';
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    setPrefersReducedMotion(!mediaQueryList.matches);

    const listener = event => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};
