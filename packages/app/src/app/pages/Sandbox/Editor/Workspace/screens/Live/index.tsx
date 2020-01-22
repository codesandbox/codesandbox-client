/**
 * TODO:
 * 1. Not logged in
 * 2. Not owner
 */

import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { NotLive } from './NotLive';
import { LiveNow } from './LiveNow';

export const Live: FunctionComponent = () => {
  const {
    state: {
      live: { isLive },
    },
  } = useOvermind();

  return isLive ? <LiveNow /> : <NotLive />;
};
