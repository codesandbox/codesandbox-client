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
    const BASE =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

    const payload = await fetch(`${BASE}/api/v1/prices`).then(x => x.json());

    setData(payload);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data;
};

export const formatCurrent = ({ currency, unit_amount }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency,
  });
  return formatter.format(unit_amount / 100);
};
