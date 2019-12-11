import React from 'react';
import { patronUrl } from '@codesandbox/common/lib/utils/url-generator';
// @ts-ignore
import PatronBadge from '-!svg-react-loader!@codesandbox/common/lib/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import { Action } from './Action';

export const PatronButton = () => (
  <Action
    href={patronUrl()}
    tooltip="Support CodeSandbox"
    Icon={PatronBadge}
    iconProps={{
      width: 16,
      height: 32,
      transform: 'scale(1.5, 1.5)',
    }}
  />
);
