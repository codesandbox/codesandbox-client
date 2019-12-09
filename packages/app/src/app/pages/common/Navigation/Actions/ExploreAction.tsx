import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { exploreUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import FlameIcon from 'react-icons/lib/go/flame';

import { Action } from '../elements';

export const ExploreAction: FunctionComponent = () => (
  <Action>
    <Tooltip content="Explore Sandboxes" placement="bottom">
      <a style={{ color: 'white' }} href={exploreUrl()}>
        <FlameIcon height={35} />
      </a>
    </Tooltip>
  </Action>
);
