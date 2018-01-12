import React from 'react';

import { NavigationLink, CenteredRow } from './elements';

function Navigation({ username, sandboxCount, likeCount }) {
  return (
    <CenteredRow alignItems="center" justifyContent="center">
      <NavigationLink
        to={`/u/${username}`}
        activeStyle={{
          color: 'white',
        }}
        exact
        border={`border-right: 1px solid rgba(255, 255, 255, 0.2)`}
      >
        SHOWCASE
      </NavigationLink>
      <NavigationLink
        to={`/u/${username}/sandboxes`}
        activeStyle={{
          color: 'white',
        }}
        border={`border-right: 1px solid rgba(255, 255, 255, 0.2)`}
      >
        SANDBOXES ({sandboxCount})
      </NavigationLink>
      <NavigationLink
        to={`/u/${username}/likes`}
        activeStyle={{
          color: 'white',
        }}
      >
        LIKES ({likeCount})
      </NavigationLink>
    </CenteredRow>
  );
}

export default Navigation;
