import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';
import BrowserIcon from 'react-icons/lib/go/browser';

import { useOvermind } from 'app/overmind';

import { Description } from '../../../elements';

import { SubTitle } from '../elements';

import { EntryContainer, MainBadge, Port } from './elements';

export const OpenPorts: FunctionComponent = () => {
  const {
    actions: {
      server: { onBrowserTabOpened, onBrowserFromPortOpened },
    },
    state: {
      editor: {
        currentSandbox: { template },
      },
      server: { ports },
    },
  } = useOvermind();

  return (
    <Margin top={1} bottom={0.5}>
      <SubTitle>Open Ports</SubTitle>

      <Margin top={0.5}>
        {ports.length > 0 ? (
          ports.map(port => (
            <EntryContainer onClick={() => onBrowserFromPortOpened(port)}>
              <Port>
                <BrowserIcon />

                <div>{port.name || port.port}</div>
              </Port>

              {port.main && <MainBadge>main</MainBadge>}
            </EntryContainer>
          ))
        ) : (
          <Description>
            {`No ports are opened. Maybe the server is still starting or it doesn't open any ports.`}
          </Description>
        )}

        {['gatsby', 'gridsome'].includes(template) && ports.length > 0 ? (
          <EntryContainer
            onClick={() =>
              onBrowserTabOpened({
                closeable: true,
                options: {
                  title: 'GraphiQL',
                  url: template === 'gridsome' ? '/___explore' : '/___graphql',
                },
              })
            }
          >
            <Port>
              <BrowserIcon />

              <div>GraphiQL</div>
            </Port>
          </EntryContainer>
        ) : null}
      </Margin>
    </Margin>
  );
};
