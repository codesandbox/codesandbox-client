import Row from '@codesandbox/common/lib/components/flex/Row';
import React, { FunctionComponent } from 'react';

import { ProfileInfo } from './ProfileInfo';
import { Stats } from './Stats';

export const UserInfo: FunctionComponent = () => (
  <Row>
    <ProfileInfo />

    <Stats />
  </Row>
);
