import React from 'react';
import styled from 'styled-components';
import Padding from 'app/components/spacing/Padding';
import Margin from 'app/components/spacing/Margin';

import Location from './Location';
import UserInfo from './UserInfo';
import MaxWidth from '../MaxWidth';

const Top = styled.div`
  display: flex;
  background-image: linear-gradient(-180deg, #121415 0%, #1F2224 100%);
  box-shadow: inset 0 -3px 4px 0 rgba(0,0,0,0.50);

  width: 100%;
  justify-content: center;
`;

const FullWidthPadding = styled(Padding)`
  width: 100%;
`;

const FullWidthMargin = styled(Margin)`
  width: 100%;
`;

export default class Header extends React.PureComponent {
  render() {
    const user = {
      name: 'Ives van Hoorne',
      username: 'CompuIves',
      avatarUrl: 'https://avatars0.githubusercontent.com/u/587016?v=3',
    };
    return (
      <Top>
        <MaxWidth>
          <FullWidthPadding horizontal={2} vertical={1.5}>
            <Location title="Profile Page" user={user} />

            <FullWidthMargin top={3} bottom={1}>
              <UserInfo user={user} />
            </FullWidthMargin>
          </FullWidthPadding>
        </MaxWidth>
      </Top>
    );
  }
}
