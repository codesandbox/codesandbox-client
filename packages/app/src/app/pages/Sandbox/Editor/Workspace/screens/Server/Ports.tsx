import { ServerPort } from '@codesandbox/common/es/types';
import {
  Collapsible,
  List,
  ListAction,
  Stack,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';
import { GoBrowser } from 'react-icons/go';

export const Ports = () => {
  const {
    actions: {
      server: { onBrowserTabOpened, onBrowserFromPortOpened },
    },
    state: {
      server: { ports },
      editor: { currentSandbox: sandbox },
    },
  } = useOvermind();

  const openPort = (port: ServerPort) => {
    onBrowserFromPortOpened({ port });
  };

  const openGraphiQLPort = () => {
    const url = sandbox.template === 'gridsome' ? '/___explore' : '/___graphql';
    onBrowserTabOpened({
      closeable: true,
      options: {
        url,
        title: 'GraphiQL',
      },
    });
  };

  return (
    <Collapsible title="Open Ports" defaultOpen>
      <List>
        {ports.length ? (
          ports.map((port: ServerPort) => (
            <ListAction onClick={() => openPort(port)}>
              <Stack
                justify="space-between"
                css={css({
                  width: '100%',
                })}
              >
                <Stack align="center">
                  <GoBrowser />
                  <Text marginLeft={2}>{port.name || port.port}</Text>
                </Stack>
                {port.main && <Text weight="medium">main</Text>}
              </Stack>
            </ListAction>
          ))
        ) : (
          <Text block variant="muted" paddingX={2}>
            No ports are open. Maybe the server is still starting or it doesn
            {"'"}t open any ports.
          </Text>
        )}

        {['gatsby', 'gridsome'].includes(sandbox.template) && ports.length ? (
          <ListAction onClick={openGraphiQLPort}>
            <Stack align="center">
              <GoBrowser />
              <Text marginLeft={2}>GraphiQL</Text>
            </Stack>
          </ListAction>
        ) : null}
      </List>
    </Collapsible>
  );
};
