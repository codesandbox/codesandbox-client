const BASE =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export default async (username, user) => {
  const jwt = JSON.parse(localStorage.getItem('jwt'));
  const data = await fetch(BASE + '/api/v1/users/' + username, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({
      user,
    }),
  });

  const profile = await data.json();

  return profile.data;
};
