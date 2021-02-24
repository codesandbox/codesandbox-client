import { Element, Collapsible, Stack, Text } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import { Netlify } from './Netlify';
import { NotLoggedIn } from './NotLoggedIn';
import { NotOwner } from './NotOwner';
import { Vercel } from './Vercel';
import { GithubPages } from './GithubPages';

export const Deployment: FunctionComponent = () => {
  const {
    actions: {
      deployment: { getDeploys },
    },
    state: {
      editor: {
        currentSandbox: { owned },
      },
      isLoggedIn,
    },
  } = useOvermind();

  useEffect(() => {
    if (owned && isLoggedIn) {
      getDeploys();
    }
  }, [getDeploys, owned, isLoggedIn]);

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  if (!owned) {
    return <NotOwner />;
  }

  return (
    <Collapsible defaultOpen title="Deployment">
      <Element paddingX={2}>
        <Text block marginBottom={6} variant="muted">
          You can deploy a production version of your sandbox using one of our
          supported providers.
        </Text>

        <Stack direction="vertical" gap={5}>
          <Vercel />

          <Netlify />
          <GithubPages />
        </Stack>
      </Element>
    </Collapsible>
  );
};
