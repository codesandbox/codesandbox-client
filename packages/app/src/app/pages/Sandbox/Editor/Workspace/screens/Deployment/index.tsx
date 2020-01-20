import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import {
  Element,
  Collapsible,
  Text,
  Stack,
  Button,
  Integration,
} from '@codesandbox/components';
import { ZeitIcon } from './icons';
import { Netlify } from './Netlify';

import { More } from '../../items/More';

export const Deployment: FunctionComponent = () => {
  const {
    actions: {
      deployment: { getDeploys },
    },
    state: {
      editor: { currentSandbox },
      isLoggedIn,
    },
  } = useOvermind();
  const showPlaceholder = !(currentSandbox.owned && isLoggedIn);

  useEffect(() => {
    if (!showPlaceholder) {
      getDeploys();
    }
  }, [getDeploys, showPlaceholder]);

  if (showPlaceholder) {
    const message = isLoggedIn ? (
      <>
        You need to own this sandbox to deploy this sandbox to Netlify or ZEIT.{' '}
        <p>Fork this sandbox to make a deploy!</p>
      </>
    ) : (
      <>You need to be signed in to deploy this sandbox to Netlify or ZEIT.</>
    );

    return <More message={message} id="github" />;
  }

  return (
    <Collapsible title="Deployment" defaultOpen>
      <Text variant="muted">
        You can deploy a production version of your sandbox using one our
        supported providers.
      </Text>
      <Element marginTop={5}>
        <Integration icon={ZeitIcon} title="ZEIT">
          <Stack direction="vertical">
            <Text variant="muted">Enables</Text>
            <Text>Deployments</Text>
          </Stack>
          <Button onClick={() => {}}>Sign In</Button>
        </Integration>
      </Element>
      <Element marginTop={5}>
        <Netlify />
      </Element>
    </Collapsible>
  );
};
