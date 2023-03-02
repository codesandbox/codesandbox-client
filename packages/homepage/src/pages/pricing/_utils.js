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
export const useLegacyPricing = () => {
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
