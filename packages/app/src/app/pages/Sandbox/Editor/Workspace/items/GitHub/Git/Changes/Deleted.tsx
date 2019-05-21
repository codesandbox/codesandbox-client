import React from 'react';
import RemovedIcon from 'react-icons/lib/go/diff-removed';
import theme from '@codesandbox/common/lib/theme';
import { Changes } from './Changes';

export const Deleted = ({ changes, hideColor }) => (
  <Changes
    changes={changes}
    color={theme.red}
    Icon={RemovedIcon}
    title="Deleted"
    hideColor={hideColor}
  />
);
