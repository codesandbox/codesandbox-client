import { useEffect, useState } from 'react';

export const useTeamList = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const BASE =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

    const devToken = localStorage.devJwt;

    const payload = await fetch(`${BASE}/api/graphql`, {
      headers: {
        Authorization: devToken ? `Bearer ${devToken}` : undefined,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query: `query AllTeams {
          me {
            personalWorkspaceId
            workspaces {
              id
              name
            }
          }
        }`,
      }),
    }).then(x => x.json());

    setData(payload.data);
  };

  useEffect(() => {
    if (document.cookie.indexOf('signedIn') > -1) {
      fetchData();
    }
  }, []);

  return data;
};
