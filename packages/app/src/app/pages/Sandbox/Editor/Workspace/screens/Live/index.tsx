import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { NotLoggedIn } from './NotLoggedIn';
import { LiveNow } from './LiveNow';
import { NotLive } from './NotLive';

export const Live: FunctionComponent = () => {
  const {
    state: {
      isLoggedIn,
      live: { isLive },
    },
  } = useOvermind();

  if (!isLoggedIn) return <NotLoggedIn />;
  return isLive ? <LiveNow /> : <NotLive />;
};
