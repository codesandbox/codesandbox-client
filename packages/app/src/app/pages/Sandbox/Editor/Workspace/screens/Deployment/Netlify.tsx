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

import { useAppState, useActions } from 'app/overmind';

import { FileIcon, FlagIcon, NetlifyIcon, VisitIcon } from './icons';

export const Netlify: FunctionComponent = () => {
  const {
    deployment: { deployWithNetlify, getNetlifyDeploys },
    modalOpened,
  } = useActions();
  const {
    deployment: {
      building,
      deploying,
      netlify: { claimUrl, site },
    },
    editor: { currentSandbox },
  } = useAppState();

  useEffect(() => {
    getNetlifyDeploys();
  }, [getNetlifyDeploys, currentSandbox.id]);

  const template = getTemplate(currentSandbox.template);
  if (template.staticDeployment === false) {
    return null;
  }

  const deploy = () => {
    track('Deploy Clicked', { provider: 'netlify' });
    deployWithNetlify();
    modalOpened({ modal: 'netlifyLogs' });
  };
  return (
    <Integration icon={NetlifyIcon} title="Netlify">
      <Element marginBottom={site ? 6 : 0} marginX={2}>
        <Text block marginBottom={4} variant="muted">
          Deploy your sandbox site to{' '}
          <Link href="https://www.netlify.com/" target="_blank">
            Netlify
          </Link>
        </Text>

        <Button disabled={deploying || building} onClick={deploy}>
          Deploy to Netlify
        </Button>
      </Element>

      {site && (
        <List>
          <ListItem>
            <Text weight="bold">{site.name}</Text>
          </ListItem>

          {site.url ? (
            <ListAction onClick={() => window.open(site.url, '_blank')}>
              <Element marginRight={2}>
                <VisitIcon />
              </Element>{' '}
              Visit Site
            </ListAction>
          ) : null}

          {site.url ? (
            <ListAction onClick={() => window.open(claimUrl, '_blank')}>
              <Element marginRight={2}>
                <FlagIcon />
              </Element>{' '}
              Claim Site
            </ListAction>
          ) : null}

          <ListAction onClick={() => modalOpened({ modal: 'netlifyLogs' })}>
            <Element marginRight={2}>
              <FileIcon />
            </Element>{' '}
            View Logs
          </ListAction>
        </List>
      )}
    </Integration>
  );
};
