// @flow
import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import Row from 'common/components/flex/Row';
import HoverMenu from 'app/components/HoverMenu';
import Relative from 'common/components/Relative';
import Tooltip from 'common/components/Tooltip';

import UserMenuComponent from './UserMenu';

const ClickableContainer = styled(Row)`
  cursor: pointer;
`;

const ProfileImage = styled.img`
  border-radius: 2px;
`;

const ProfileInfo = styled.div`
  font-weight: 400;
  text-align: right;
  margin-right: 1em;

  @media (max-width: 1300px) {
    display: none;
  }
`;

const Name = styled.div`
  padding-bottom: 0.2em;
  color: white;
  font-size: 1em;
`;

const Username = styled.div`
  color: ${props => (props.main ? 'white' : 'rgba(255, 255, 255, 0.6)')};
  font-size: ${props => (props.main ? 1 : 0.875)}em;
`;

function User({ signals, store, small }) {
  const smallImage = small || false;
  const { user, userMenuOpen } = store;

  return (
    <Relative>
      <ClickableContainer
        onClick={() => {
          signals.toggleUserMenuClicked();
        }}
      >
        <ProfileInfo>
          {user.name && <Name>{user.name}</Name>}
          <Username main={!user.name}>{user.username}</Username>
        </ProfileInfo>

        <Tooltip title="User Menu">
          <ProfileImage
            alt={user.username}
            width={smallImage ? 35 : 40}
            height={smallImage ? 35 : 40}
            src={user.avatarUrl}
          />
        </Tooltip>
      </ClickableContainer>
      {userMenuOpen && (
        <HoverMenu
          onClose={() => {
            signals.toggleUserMenuClicked();
          }}
        >
          <UserMenu
            openPreferences={() => {
              signals.openModal({ modal: 'preferences' });
            }}
            signOut={() => {
              signals.signOut();
            }}
            username={user.username}
          />
        </HoverMenu>
      )}
    </Relative>
  );
}

export default inject('store', 'signals')(observer(User));
