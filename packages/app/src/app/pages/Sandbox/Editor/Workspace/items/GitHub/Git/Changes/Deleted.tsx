import theme from '@codesandbox/common/lib/theme';
import React from 'react';
import RemovedIcon from 'react-icons/lib/go/diff-removed';

import { Changes } from './Changes';

export const Deleted = ({ changes, hideColor }) => (
  <Changes
    changes={changes}
    color={theme.red}
    hideColor={hideColor}
    Icon={RemovedIcon}
    title="Deleted"
  />
);
