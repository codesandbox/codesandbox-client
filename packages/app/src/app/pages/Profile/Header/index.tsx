import MaxWidth from '@codesandbox/common/es/components/flex/MaxWidth';
import { Element } from '@codesandbox/components';
import { Navigation } from 'app/pages/common/Navigation';
import React, { FunctionComponent } from 'react';

import { FullWidthMargin, FullWidthPadding, Top } from './elements';
import { UserInfo } from './UserInfo';

export const Header: FunctionComponent = () => (
  <Top>
    <Element style={{ width: '100vw' }}>
      <Navigation title="Profile Page" />
      <MaxWidth>
        <FullWidthPadding horizontal={2} vertical={1.5}>
          <FullWidthMargin top={3} bottom={-5}>
            <UserInfo />
          </FullWidthMargin>
        </FullWidthPadding>
      </MaxWidth>
    </Element>
  </Top>
);
