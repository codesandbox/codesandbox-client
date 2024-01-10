import {
  Collapsible,
  List,
  ListAction,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent } from 'react';
import BrowserIcon from 'react-icons/lib/go/browser';
import css from '@styled-system/css';

import { useAppState, useActions } from 'app/overmind';

export const Ports: FunctionComponent = () => {
  const { onBrowserTabOpened, onBrowserFromPortOpened } = useActions().server;
  const {
    editor: {
      currentSandbox: { template },
    },
    server: { ports },
  } = useAppState();

  const openGraphiQLPort = () =>
    onBrowserTabOpened({
      closeable: true,
      options: {
        url: template === 'gridsome' ? '/___explore' : '/___graphql',
        title: 'GraphiQL',
      },
    });

  return (
    <Collapsible title="Open Ports" defaultOpen>
      <List>
        {ports.length > 0 ? (
          ports.map(port => (
            <ListAction onClick={() => onBrowserFromPortOpened(port)}>
              <Stack css={css({ width: '100%' })} justify="space-between">
                <Stack align="center">
                  <BrowserIcon />

                  <Text marginLeft={2}>{port.name || port.port}</Text>
                </Stack>

                {port.main ? <Text weight="medium">main</Text> : null}
              </Stack>
            </ListAction>
          ))
        ) : (
          <Text block variant="muted" paddingX={2}>
            {`No ports are open. Maybe the server is still starting or it doesn't open any ports.`}
          </Text>
        )}

        {['gatsby', 'gridsome'].includes(template) && ports.length > 0 ? (
          <ListAction onClick={openGraphiQLPort}>
            <Stack align="center">
              <BrowserIcon />

              <Text marginLeft={2}>GraphiQL</Text>
            </Stack>
          </ListAction>
        ) : null}
      </List>
    </Collapsible>
  );
};
