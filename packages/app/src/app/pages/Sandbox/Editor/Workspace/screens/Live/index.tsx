import React, { FunctionComponent } from 'react';

import { useAppState } from 'app/overmind';

import { LiveNow } from './LiveNow';
import { NotLive } from './NotLive';
import { NotLoggedIn } from './NotLoggedIn';

export const Live: FunctionComponent = () => {
  const {
    isLoggedIn,
    live: { isLive },
  } = useAppState();

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return isLive ? <LiveNow /> : <NotLive />;
};
