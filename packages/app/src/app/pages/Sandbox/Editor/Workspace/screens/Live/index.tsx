/**
 * TODO: Handle not logged in
 */

import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { NotLive } from './NotLive';
import { LiveNow } from './LiveNow';

export const Live: FunctionComponent = () => {
  const {
    state: {
      editor: {
        currentSandbox: { owned },
      },
      live: { isLive },
      isLoggedIn,
    },
  } = useOvermind();

  const showPlaceholder = (!isLive && !owned) || !isLoggedIn;

  if (showPlaceholder) {
    const message = isLoggedIn ? (
      <>
        You need to own this sandbox to open a live session to collaborate with
        others in real time.{' '}
        <p>Fork this sandbox to live share it with others!</p>
      </>
    ) : (
      `You need to be signed in to open a live session to collaborate with others in real time. Sign in to live share this sandbox!`
    );
    return <div>{message}</div>;
    // return <More message={message} id="live" />;
  }

  return <div>{isLive ? <LiveNow /> : <NotLive />}</div>;
};
