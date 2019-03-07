const BASE =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

const fetchCurrentUser = async () => {
  const jwt = JSON.parse(localStorage.getItem('jwt'));
  const get = await fetch(BASE + '/api/v1/users/current', {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  const { data } = await get.json();

  return data;
};

export default fetchCurrentUser;
