import React from 'react';
import AddedIcon from 'react-icons/lib/go/diff-added';
import theme from '@codesandbox/common/lib/theme';
import { Changes } from './Changes';

export const Added = ({ changes, hideColor }) => (
  <Changes
    changes={changes}
    color={theme.green}
    Icon={AddedIcon}
    title="Added"
    hideColor={hideColor}
  />
);
