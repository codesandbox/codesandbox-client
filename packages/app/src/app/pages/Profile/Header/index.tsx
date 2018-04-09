import * as React from 'react';

import Navigation from 'app/pages/common/Navigation';
import MaxWidth from 'common/components/flex/MaxWidth';
import { Profile } from 'app/store/modules/profile/types';

import UserInfo from './UserInfo';
import { Top, FullWidthPadding, FullWidthMargin } from './elements';

export type Props = {
  user: Profile;
};

const Header: React.SFC<Props> = ({ user }) => (
  <Top>
    <MaxWidth>
      <FullWidthPadding horizontal={2} vertical={1.5}>
        <Navigation title="Profile Page" />

        <FullWidthMargin top={3} bottom={-5}>
          <UserInfo user={user} />
        </FullWidthMargin>
      </FullWidthPadding>
    </MaxWidth>
  </Top>
);

export default Header;
