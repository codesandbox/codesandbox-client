import React, { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { Button } from '@codesandbox/common/lib/components/Button';
import { Container } from '../LiveSessionEnded/elements';
import { Heading, Explanation } from '../elements';

import { List, Item } from './elements';

export const NetlifyLogs = () => {
  const [logs, setLogs] = useState(['Contacting Netlify']);
  const {
    state: {
      deployment: { netlifyLogs },
    },
    actions: { modalClosed },
  } = useOvermind();

  useEffect(() => {
    const getLogs = async () => {
      const url = netlifyLogs;

      const data = await fetch(url);
      // eslint-disable-next-line no-shadow
      const { logs } = await data.json();

      setLogs(logs);
    };

    const interval = setInterval(getLogs, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [netlifyLogs]);

  return (
    <Container>
      <Heading>Sandbox Site Logs</Heading>
      <Explanation>
        Builds typically take a minute or two to complete
      </Explanation>
      <List>
        {logs.map((log, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Item key={i}>{log}</Item>
        ))}
      </List>
      <Button small onClick={modalClosed}>
        Close
      </Button>
    </Container>
  );
};
