import { inject, hooksObserver } from 'app/componentConnectors';
import React, { useEffect } from 'react';

import { Description } from '../../elements';

import { More } from '../More';

import { Netlify } from './Netlify';
import { Zeit } from './Zeit';

export const Deployment = inject('store', 'signals')(
  hooksObserver(
    ({
      store: {
        editor: { currentSandbox },
        isLoggedIn,
      },
      signals: {
        deployment: { getDeploys },
      },
    }) => {
      const showPlaceholder = !(currentSandbox.owned && isLoggedIn);

      useEffect(() => {
        if (!showPlaceholder) {
          getDeploys();
        }
      }, [getDeploys, showPlaceholder]);

      if (showPlaceholder) {
        const message = isLoggedIn ? (
          <>
            You need to own this sandbox to deploy this sandbox to Netlify or
            ZEIT. <p>Fork this sandbox to make a deploy!</p>
          </>
        ) : (
          <>
            You need to be signed in to deploy this sandbox to Netlify or ZEIT.
          </>
        );

        return <More message={message} id="github" />;
      }

      return (
        <div>
          <Description>
            You can deploy a production version of your sandbox using one our
            supported providers.
          </Description>

          <Zeit />

          <Netlify />
        </div>
      );
    }
  )
);
