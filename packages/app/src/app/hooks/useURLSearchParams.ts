import { useLocation, useHistory } from 'react-router-dom';

export type ReturnType = {
  getQueryParam: (key: string) => string | null;
  removeQueryParam: (key: string) => void;
  setQueryParam: (key: string, value: string) => void;
};

export const useURLSearchParams = (): ReturnType => {
  const location = useLocation();
  const history = useHistory();

  const params = new URLSearchParams(location.search);

  const getQueryParam = (key: string) => {
    return params.get(key);
  };

  const removeQueryParam = (key: string) => {
    params.delete(key);
    history.replace(`${location.pathname}?${params.toString()}`);
  };

  const setQueryParam = (key: string, value: string) => {
    params.set(key, value);
    history.replace(`${location.pathname}?${params.toString()}`);
  };

  return {
    getQueryParam,
    removeQueryParam,
    setQueryParam,
  };
};
