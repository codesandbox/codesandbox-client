import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { exploreUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import FlameIcon from 'react-icons/lib/go/flame';
import { Link } from 'react-router-dom';

import { Action } from '../elements';

export const ExploreAction: FunctionComponent = () => (
  <Action>
    <Tooltip content="Explore Sandboxes" placement="bottom">
      <Link style={{ color: 'white' }} to={exploreUrl()}>
        <FlameIcon height={35} />
      </Link>
    </Tooltip>
  </Action>
);
