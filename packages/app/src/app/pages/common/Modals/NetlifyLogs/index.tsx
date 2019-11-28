import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';

import { useOvermind } from 'app/overmind';

import { Explanation, Heading } from '../elements';
import { Container } from '../LiveSessionEnded/elements';

import { Item, List } from './elements';

export const NetlifyLogs: FunctionComponent = () => {
  const {
    actions: { modalClosed },
    state: {
      deployment: { netlifyLogs: netlifyLogsUrl },
    },
  } = useOvermind();
  const [logs, setLogs] = useState(['Waiting for build to start...']);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { logs: fetchedLogs } = await fetch(netlifyLogsUrl).then(data =>
        data.json()
      );

      if (fetchedLogs.length > 0) {
        setLogs(fetchedLogs);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [netlifyLogsUrl]);

  return (
    <Container>
      <Heading>Sandbox Site Logs</Heading>

      <Explanation>
        Builds typically take a minute or two to complete
      </Explanation>

      <List>
        {logs.map(log => (
          <Item key={log}>{log}</Item>
        ))}
      </List>

      <Button onClick={() => modalClosed()} small>
        Close
      </Button>
    </Container>
  );
};
