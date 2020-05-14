import React, { FunctionComponent, useEffect, useState } from 'react';

import { Element, Button, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import { Item } from './elements';
import { Alert } from '../Common/Alert';

export const NetlifyLogs: FunctionComponent = () => {
  const {
    actions: { modalClosed },
    state: {
      deployment: { netlifyLogs: netlifyLogsUrl },
    },
  } = useOvermind();
  const [logs, setLogs] = useState(['Waiting for build to start']);

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
    <Alert
      title="Sandbox Site Logs"
      description="Builds typically take a minute or two to complete"
    >
      <Element
        marginY={6}
        padding={4}
        css={css({
          fontFamily: "'MonoLisa'",
          maxHeight: 400,
          overflow: 'auto',
          wordBreak: 'break-word',
          borderRadius: 'medium',
          border: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        {logs.map(log => (
          <Item marginBottom={2} key={log}>
            {log}
          </Item>
        ))}
      </Element>
      <Stack gap={2} align="center" justify="flex-end">
        <Button
          css={css({
            width: 'auto',
          })}
          variant="link"
          onClick={modalClosed}
        >
          Close
        </Button>
      </Stack>
    </Alert>
  );
};
