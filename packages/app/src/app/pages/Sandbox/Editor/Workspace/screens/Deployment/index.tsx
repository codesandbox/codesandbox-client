import { Element, Collapsible, Stack, Text } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';

import { useAppState, useActions } from 'app/overmind';

import { Netlify } from './Netlify';
import { NotLoggedIn } from './NotLoggedIn';
import { NotOwner } from './NotOwner';
import { Vercel } from './Vercel';
import { GithubPages } from './GithubPages';

const MINIMUM_USER_AGE_FOR_NETLIFY = 14 * 24 * 60 * 60 * 1000;

export const Deployment: FunctionComponent = () => {
  const {
    editor: {
      currentSandbox: { owned },
    },
    isLoggedIn,
    user,
  } = useAppState();
  const { getDeploys } = useActions().deployment;

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

  const userAge =
    Date.now() - new Date(user.insertedAt || Date.now()).getTime();

  return (
    <Collapsible defaultOpen title="Deployment">
      <Element paddingX={2}>
        <Text block marginBottom={6} variant="muted">
          You can deploy a production version of your sandbox using one of our
          supported providers.
        </Text>

        <Stack direction="vertical" gap={5}>
          <Vercel />

          {userAge >= MINIMUM_USER_AGE_FOR_NETLIFY ? <Netlify /> : null}
          <GithubPages />
        </Stack>
      </Element>
    </Collapsible>
  );
};
