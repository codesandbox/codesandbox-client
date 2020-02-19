import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import React, { FunctionComponent } from 'react';

import { Navigation } from 'app/pages/common/Navigation';

import { FullWidthMargin, FullWidthPadding, Top } from './elements';
import { UserInfo } from './UserInfo';

export const Header: FunctionComponent = () => (
  <Top>
    <MaxWidth>
      <FullWidthPadding horizontal={2} vertical={1.5}>
        <Navigation title="Profile Page" />

        <FullWidthMargin top={3} bottom={-5}>
          <UserInfo />
        </FullWidthMargin>
      </FullWidthPadding>
    </MaxWidth>
  </Top>
);
