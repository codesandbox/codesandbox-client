import getTemplate from '@codesandbox/common/lib/templates';
import { inject, hooksObserver } from 'app/componentConnectors';
import React, { useEffect, useState } from 'react';

import { Wrapper } from '../elements';

import { DeployButton } from './DeployButton';
import { SiteInfo } from './SiteInfo';

export const Netlify = inject('store', 'signals')(
  hooksObserver(
    ({
      signals: {
        deployment: { getNetlifyDeploys },
      },
      store: {
        deployment: { deploying, netlifySite },
        editor: { currentSandbox },
      },
    }) => {
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
    }
  )
);
