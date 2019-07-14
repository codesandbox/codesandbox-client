import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore, useSignals } from 'app/store';
import { Description } from '../../elements';
import ZeitDeployments from './Zeit';
import NetlifyDeployments from './Netlify';
import { More } from '../More';

const Deployment = observer(() => {
  const store = useStore();
  const signals = useSignals();

  const showPlaceholder =
    !store.editor.currentSandbox.owned || !store.isLoggedIn;

  useEffect(() => {
    if (!showPlaceholder) {
      signals.deployment.getDeploys();
    }
  }, [showPlaceholder, signals]);

  if (showPlaceholder) {
    const message = store.isLoggedIn ? (
      <>
        You need to own this sandbox to deploy this sandbox to Netlify or ZEIT.{' '}
        <p>Fork this sandbox to make a deploy!</p>
      </>
    ) : (
      <>You need to be signed in to deploy this sandbox to Netlify or ZEIT.</>
    );

    return <More message={message} id="github" />;
  }

  return (
    <div>
      <Description>
        You can deploy a production version of your sandbox using one our
        supported providers.
      </Description>
      <ZeitDeployments />
      <NetlifyDeployments />
    </div>
  );
});

export default Deployment;
