import React, { FunctionComponent, useEffect, useState } from 'react';

import { Element, Button, Stack } from '@codesandbox/components';
import { useAppState, useEffects, useActions } from 'app/overmind';
import css from '@styled-system/css';
import { Item } from './elements';
import { Alert } from '../Common/Alert';

export const GithubPagesLogs: FunctionComponent = () => {
  const effects = useEffects();
  const { modalClosed } = useActions();
  const { currentSandbox } = useAppState().editor;
  const { githubSite } = useAppState().deployment;
  const [logs, setLogs] = useState(['Waiting for build to start']);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { logs: fetchedLogs, status } = await effects.githubPages.getLogs(
        currentSandbox.id
      );

      if (fetchedLogs.length > 0) {
        setLogs(fetchedLogs);
      }

      if (status === 'DONE') {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Alert
      title="Sandbox Site Logs"
      description="Deploys to GitHub may take up to 15 minutes before being visible"
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
        <Button
          css={css({
            width: 'auto',
          })}
          onClick={() => {
            window.open(
              `https://${githubSite.ghLogin}.github.io/${githubSite.name}/`,
              '_blank'
            );
          }}
        >
          Open Github Site
        </Button>
      </Stack>
    </Alert>
  );
};
