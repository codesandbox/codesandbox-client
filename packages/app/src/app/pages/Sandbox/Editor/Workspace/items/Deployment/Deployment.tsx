import React, { useEffect } from 'react';
import { useSignals } from 'app/store';
import { Description } from '../../elements';
import { Zeit } from './Zeit';
import { Netlify } from './Netlify';

export const Deployment = () => {
  const {
    deployment: { getDeploys },
  } = useSignals();
  useEffect(() => getDeploys(), []); // eslint-disable-line

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
};
