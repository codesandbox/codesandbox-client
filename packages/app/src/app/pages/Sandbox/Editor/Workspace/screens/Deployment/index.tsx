import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import { Element, Collapsible, Stack, Text } from '@codesandbox/components';

import { Netlify } from './Netlify';
import { Zeit } from './Zeit';
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
        <Text variant="muted">
          You can deploy a production version of your sandbox using one our
          supported providers.
        </Text>
        <Stack direction="vertical" gap={5}>
          <Zeit />
          <Netlify />
        </Stack>
      </Element>
    </Collapsible>
  );
};
