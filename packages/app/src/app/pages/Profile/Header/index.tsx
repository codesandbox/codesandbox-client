import * as React from 'react';

import Navigation from 'app/pages/common/Navigation';
import MaxWidth from 'common/components/flex/MaxWidth';

import UserInfo from './UserInfo';
import { Top, FullWidthPadding, FullWidthMargin } from './elements';

import { Profile } from 'app/store/modules/profile/types'

type Props = {
  user: Profile
}

export default class Header extends React.PureComponent<Props> {
  render() {
    const { user } = this.props;
    return (
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
  }
}
