import getTemplate from '@codesandbox/common/lib/templates';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import { useSignals, useStore } from 'app/store';

import { Wrapper } from '../elements';

import { DeployButton } from './DeployButton';
import { SiteInfo } from './SiteInfo';

export const Netlify = observer(() => {
  const {
    deployment: { getNetlifyDeploys },
  } = useSignals();
  const {
    deployment: { deploying, netlifySite },
    editor: { currentSandbox },
  } = useStore();

  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    getNetlifyDeploys();
  }, [getNetlifyDeploys]);

  const template = getTemplate(currentSandbox.template);

  return (
    template.netlify !== false && (
      <Wrapper loading={deploying}>
        <DeployButton
          isOpen={isVisible}
          toggle={() => setVisible(show => !show)}
        />

        {netlifySite && isVisible ? <SiteInfo /> : null}
      </Wrapper>
    )
  );
});
