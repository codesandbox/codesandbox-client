/**
 * TODO:
 * 1. Not logged in
 * 2. Not owner
 */

import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { LiveNow } from './LiveNow';
import { NotLive } from './NotLive';

export const Live: FunctionComponent = () => {
  const {
    state: {
      live: { isLive },
    },
  } = useOvermind();

  return isLive ? <LiveNow /> : <NotLive />;
};
