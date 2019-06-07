import theme from '@codesandbox/common/lib/theme';
import React from 'react';
import ModifiedIcon from 'react-icons/lib/go/diff-modified';

import { Changes } from './Changes';

export const Modified = ({ changes, hideColor }) => (
  <Changes
    changes={changes}
    color={theme.secondary}
    hideColor={hideColor}
    Icon={ModifiedIcon}
    title="Modified"
  />
);
