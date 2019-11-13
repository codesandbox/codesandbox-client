import getTemplate from '@codesandbox/common/lib/templates';

import React, { FunctionComponent, useEffect, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { Wrapper } from '../elements';

import { DeployButton } from './DeployButton';
import { SiteInfo } from './SiteInfo';

export const Netlify: FunctionComponent = () => {
  const {
    actions: {
      deployment: { getNetlifyDeploys },
    },
    state: {
      deployment: { deploying, netlifySite },
      editor: { currentSandbox },
    },
  } = useOvermind();
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
};
