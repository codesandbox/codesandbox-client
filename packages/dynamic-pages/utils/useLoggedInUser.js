import { useState, useEffect } from 'react';

export default () => {
  const [user, setUser] = useState({});

  const fetchCurrentUser = () => {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    const BASE =
      process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

    window
      .fetch(BASE + '/api/v1/users/current', {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then(x => x.json())
      .then(({ data }) => setUser(data));
  };

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      fetchCurrentUser();
    }
  }, []);

  return user;
};
