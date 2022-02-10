import { useEffect, useState } from 'react';

export const usePricing = () => {
  const [data, setData] = useState(null);
  const fetchData = async () => {
    const BASE =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

    const devToken = localStorage.devJwt;

    const payload = await fetch(`${BASE}/api/v1/prices`, {
      headers: { Authorization: devToken ? `Bearer ${devToken}` : undefined },
    }).then(x => x.json());

    setData(payload);
  };

  useEffect(() => {
    if (document.cookie.indexOf('signedIn') > -1) {
      fetchData();
    }
  }, []);

  return data;
};
