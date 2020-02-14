import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { NavigationLink, CenteredRow } from './elements';

export const Navigation: FunctionComponent = () => {
  const {
    state: {
      profile: {
        current: { givenLikeCount, sandboxCount, username },
      },
    },
  } = useOvermind();

  return (
    <CenteredRow alignItems="center" justifyContent="center">
      <NavigationLink exact to={`/u/${username}`}>
        SHOWCASE
      </NavigationLink>

      <NavigationLink to={`/u/${username}/sandboxes`}>
        SANDBOXES ({sandboxCount})
      </NavigationLink>

      <NavigationLink isLast to={`/u/${username}/likes`}>
        LIKES ({givenLikeCount})
      </NavigationLink>
    </CenteredRow>
  );
};
