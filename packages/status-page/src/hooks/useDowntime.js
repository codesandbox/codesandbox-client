import { useState, useEffect } from 'react';
import request from '../utils/fetch';
import { useUp } from './useUp';

export const useDowntime = () => {
  const [up, loading] = useUp();
  const [downtimes, setDowntimes] = useState([]);

  useEffect(() => {
    const values = [];
    !loading &&
      up.map(product =>
        request(`/checks/${product.token}/downtimes`).then(req => {
          values.push({
            product,
            downtimes: req.data,
          });
          if (values.length === up.length) {
            setDowntimes(values);
          }
        })
      );
  }, [loading, up]);

  return [downtimes, up, loading];
};
