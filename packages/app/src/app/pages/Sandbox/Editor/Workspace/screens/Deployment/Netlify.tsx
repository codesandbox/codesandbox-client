import getTemplate from '@codesandbox/common/lib/templates';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  Button,
  Element,
  Integration,
  Link,
  List,
  ListAction,
  ListItem,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import { FileIcon, FlagIcon, NetlifyIcon, VisitIcon } from './icons';

export const Netlify: FunctionComponent = () => {
  const {
    actions: {
      deployment: { deployWithNetlify, getNetlifyDeploys },
      modalOpened,
    },
    state: {
      deployment: {
        building,
        deploying,
        netlifyClaimUrl,
        netlifyLogs,
        netlifySite,
      },
      editor: { currentSandbox },
    },
  } = useOvermind();

  useEffect(() => {
    getNetlifyDeploys();
  }, [getNetlifyDeploys]);

  const template = getTemplate(currentSandbox.template);

  return (
    template.netlify !== false && (
      <Integration icon={NetlifyIcon} title="Netlify">
          <Element marginBottom={netlifySite ? 6 : 0} marginX={2}>
            <Text block marginBottom={4} variant="muted">
              Deploy your sandbox site to{' '}
              <Link href="https://www.netlify.com/" target="_blank">
                Netlify
              </Link>
            </Text>

            <Button
              disabled={deploying || building}
              onClick={() => {
                track('Deploy Clicked', { provider: 'netlify' });

                deployWithNetlify();
              }}
            >
              Deploy to Netlify
            </Button>
          </Element>

          {netlifySite && (
            <List>
              <ListItem>
                <Text weight="bold">{netlifySite.name}</Text>
              </ListItem>

              {building && !netlifyLogs ? (
                <ListItem>
                  <Text variant="muted">Building</Text>
                </ListItem>
              ) : null}

              {netlifySite.url ? (
                <ListAction
                  onClick={() => window.open(netlifySite.url, '_blank')}
                >
                  <Element marginRight={2}>
                    <VisitIcon />
                  </Element>{' '}
                  Visit Site
                </ListAction>
              ) : null}

              {netlifySite.url ? (
                <ListAction
                  onClick={() => window.open(netlifyClaimUrl, '_blank')}
                >
                  <Element marginRight={2}>
                    <FlagIcon />
                  </Element>{' '}
                  Claim Site
                </ListAction>
              ) : null}

              {netlifyLogs ? (
                <ListAction
                  onClick={() => modalOpened({ modal: 'netlifyLogs' })}
                >
                  <Element marginRight={2}>
                    <FileIcon />
                  </Element>{' '}
                  View Logs
                </ListAction>
              ) : null}
            </List>
          )}
        </Integration>
    )
  );
};
