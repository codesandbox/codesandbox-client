import Tooltip from '@codesandbox/common/es/components/Tooltip';
import { exploreUrl } from '@codesandbox/common/es/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { GoFlame } from 'react-icons/go';

import { Action } from '../elements';

export const ExploreAction: FunctionComponent = () => (
  <Action>
    <Tooltip content="Explore Sandboxes" placement="bottom">
      <a style={{ color: 'white' }} href={exploreUrl()}>
        <GoFlame height={35} />
      </a>
    </Tooltip>
  </Action>
);
