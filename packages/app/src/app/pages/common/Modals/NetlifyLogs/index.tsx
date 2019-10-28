import React, { FunctionComponent, useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';

import { Button } from '@codesandbox/common/lib/components/Button';
import { Container } from '../LiveSessionEnded/elements';
import { Heading, Explanation } from '../elements';

import { List, Item } from './elements';

const NetlifyLogs: FunctionComponent = () => {
  const [logs, setLogs] = useState(['Contacting Netlify']);
  const {
    state: {
      deployment: { netlifyLogs: url },
    },
    actions: { modalClosed },
  } = useOvermind();

  useEffect(() => {
    const getLogs = async apiUrl => {
      const data = await fetch(apiUrl);
      const { logs: newLogs } = await data.json();
      setLogs(newLogs);
    };
    const interval = setInterval(() => getLogs(url), 2000);
    return () => {
      clearInterval(interval);
    };
  }, [url]);

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
      <Button small onClick={() => modalClosed()}>
        Close
      </Button>
    </Container>
  );
};

export default NetlifyLogs;
