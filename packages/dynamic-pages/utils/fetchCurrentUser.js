const BASE =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

const fetchCurrentUser = async () => {
  const get = await fetch(BASE + '/api/v1/users/current');
  const { data } = await get.json();

  return data;
};

export default fetchCurrentUser;
