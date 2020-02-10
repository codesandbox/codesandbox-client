import React, { useEffect } from 'react';
import getTemplate from '@codesandbox/common/lib/templates';
import track from '@codesandbox/common/lib/utils/analytics';
import { useOvermind } from 'app/overmind';

import {
  Element,
  ListAction,
  Text,
  Link,
  List,
  ListItem,
  Button,
  Integration,
} from '@codesandbox/components';

import { NetlifyIcon, FileIcon, VisitIcon, FlagIcon } from './icons';

export const Netlify = () => {
  const {
    actions: {
      modalOpened,
      deployment: { deployWithNetlify, getNetlifyDeploys },
    },
    state: {
      deployment: {
        deploying,
        netlifySite,
        building,
        netlifyLogs,
        netlifyClaimUrl,
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
      <>
        <Integration icon={NetlifyIcon} title="netlify">
          <Element marginX={2} marginBottom={netlifySite ? 6 : 0}>
            <Text variant="muted" block marginBottom={4}>
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
              {building && !netlifyLogs && (
                <ListItem>
                  <Text variant="muted">Building</Text>
                </ListItem>
              )}

              {netlifySite.url && (
                <ListAction
                  onClick={() => window.open(netlifySite.url, '_blank')}
                >
                  <Element marginRight={2}>
                    <VisitIcon />
                  </Element>{' '}
                  Visit Site
                </ListAction>
              )}

              {netlifySite.url && (
                <ListAction
                  onClick={() => window.open(netlifyClaimUrl, '_blank')}
                >
                  <Element marginRight={2}>
                    <FlagIcon />
                  </Element>{' '}
                  Claim Site
                </ListAction>
              )}

              {netlifyLogs && (
                <ListAction
                  onClick={() => modalOpened({ modal: 'netlifyLogs' })}
                >
                  <Element marginRight={2}>
                    <FileIcon />
                  </Element>{' '}
                  View Logs
                </ListAction>
              )}
            </List>
          )}
        </Integration>
      </>
    )
  );
};
