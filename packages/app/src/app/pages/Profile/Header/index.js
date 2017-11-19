import React from 'react';
import styled from 'styled-components';
import Navigation from 'app/containers/Navigation';
import Padding from 'common/components/spacing/Padding';
import Margin from 'common/components/spacing/Margin';
import MaxWidth from 'common/components/flex/MaxWidth';

import type { User } from 'common/types';

import UserInfo from './UserInfo';

const Top = styled.div`
  display: flex;
  background-image: linear-gradient(-180deg, #121415 0%, #1f2224 100%);
  box-shadow: inset 0 -3px 4px 0 rgba(0, 0, 0, 0.5);

  width: 100%;
  justify-content: center;
`;

const FullWidthPadding = styled(Padding)`width: 100%;`;

const FullWidthMargin = styled(Margin)`width: 100%;`;

type Props = {
  user: User,
};

export default class Header extends React.PureComponent {
  props: Props;

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
