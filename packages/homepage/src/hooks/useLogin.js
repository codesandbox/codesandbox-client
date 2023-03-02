import { useEffect, useState } from 'react';

export const useLogin = () => {
  const [user, setUser] = useState(null);
  const fetchCurrentUser = async () => {
    try {
      const BASE =
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

      const { data } = await fetch(BASE + '/api/v1/users/current').then(x =>
        x.json()
      );

      setUser(data);
    } catch {
      //
    }
  };

  useEffect(() => {
    if (document.cookie.indexOf('signedIn') > -1) {
      fetchCurrentUser();
    }
  }, []);

  return user;
};
