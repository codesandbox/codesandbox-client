import { useState, useEffect } from 'react';
import request from '../utils/fetch';

export const useUp = () => {
  const [up, setUp] = useState();
  const [loading, setLoading] = useState(true);
  const getUp = async () => {
    const api = await request(`/checks`);
    return api.data;
  };

  useEffect(() => {
    setLoading(true);
    getUp().then(a => {
      setUp(a);
      setLoading(false);
    });
  }, []);

  return [up, loading];
};
