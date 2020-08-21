import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { LiveNow } from './LiveNow';
import { NotLive } from './NotLive';
import { NotLoggedIn } from './NotLoggedIn';

export const Live: FunctionComponent = () => {
  const {
    state: {
      isLoggedIn,
      live: { isLive },
    },
  } = useOvermind();

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return isLive ? <LiveNow /> : <NotLive />;
};
