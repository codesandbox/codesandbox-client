import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { patronUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

// @ts-ignore
import PatronBadge from '-!svg-react-loader!@codesandbox/common/lib/utils/badges/svg/patron-4.svg';

import { Action } from '../elements';

export const PatronAction: FunctionComponent = () => (
  <Action>
    <Tooltip content="Support CodeSandbox" placement="bottom">
      <Link to={patronUrl()}>
        <PatronBadge height={40} width={40} />
      </Link>
    </Tooltip>
  </Action>
);
