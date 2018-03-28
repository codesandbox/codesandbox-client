import * as React from 'react';
import { connect } from 'app/fluent';

import HoverMenu from 'app/components/HoverMenu';
import Relative from 'common/components/Relative';
import Tooltip from 'common/components/Tooltip';

import Menu from './Menu';
import {
  ClickableContainer,
  ProfileImage,
  ProfileInfo,
  Name,
  Username,
} from './elements';

type Props = {
  small?: boolean
}

export default connect<Props>()
  .with(({ state, signals }) => ({
    user: state.user,
    userMenuOpen: state.userMenuOpen,
    userMenuOpened: signals.userMenuOpened,
    userMenuClosed: signals.userMenuClosed,
    modalOpened: signals.modalOpened,
    signOutClicked: signals.signOutClicked
  }))
  .to(
    function UserMenu({ user, userMenuOpen, small, userMenuOpened, userMenuClosed, modalOpened, signOutClicked }) {
      const smallImage = small || false;

      return (
        <Relative>
          <ClickableContainer onClick={() => userMenuOpened()}>
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
            <HoverMenu onClose={() => userMenuClosed()}>
              <Menu
                openPreferences={() => {
                  modalOpened({ modal: 'preferences' });
                }}
                signOut={() => {
                  signOutClicked();
                }}
                username={user.username}
              />
            </HoverMenu>
          )}
        </Relative>
      );
    }
  )
