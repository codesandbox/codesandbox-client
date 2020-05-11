import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import { Element, Collapsible, Stack, Text } from '@codesandbox/components';

import { Netlify } from './Netlify';
import { Vercel } from './Vercel';
import { NotLoggedIn } from './NotLoggedIn';
import { NotOwner } from './NotOwner';

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
    if (owned && isLoggedIn) getDeploys();
  }, [getDeploys, owned, isLoggedIn]);

  if (!isLoggedIn) return <NotLoggedIn />;
  if (!owned) return <NotOwner />;

  return (
    <Collapsible title="Deployment" defaultOpen>
      <Element paddingX={2}>
        <Text variant="muted" block marginBottom={6}>
          You can deploy a production version of your sandbox using one of our
          supported providers - Netlify or Vercel.
        </Text>
        <Stack direction="vertical" gap={5}>
          <Vercel />
          <Netlify />
        </Stack>
      </Element>
    </Collapsible>
  );
};
