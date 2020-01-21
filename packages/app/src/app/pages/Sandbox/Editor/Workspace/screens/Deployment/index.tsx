import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import { Element, Collapsible, Text } from '@codesandbox/components';

import { Netlify } from './Netlify';
import { Zeit } from './Zeit';

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
        <Text block>
          You need to own this sandbox to deploy this sandbox to Netlify or
          ZEIT.
        </Text>
        <Text>Fork this sandbox to make a deploy!</Text>
      </>
    ) : (
      <Text>
        You need to be signed in to deploy this sandbox to Netlify or ZEIT.
      </Text>
    );

    return (
      <Collapsible title="Deployment" defaultOpen>
        <Element paddingX={2}>
          <More message={message} id="deployment" />
        </Element>
      </Collapsible>
    );
  }

  return (
    <Collapsible title="Deployment" defaultOpen>
      <Element paddingX={2}>
        <Text variant="muted">
          You can deploy a production version of your sandbox using one our
          supported providers.
        </Text>
        <Zeit />
        <Element marginTop={5}>
          <Netlify />
        </Element>
      </Element>
    </Collapsible>
  );
};
