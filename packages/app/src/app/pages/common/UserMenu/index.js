import * as React from 'react';
import { inject, observer } from 'mobx-react';

import HoverMenu from 'app/components/HoverMenu';
import Relative from 'common/components/Relative';
import ChevronDown from 'react-icons/lib/md/arrow-drop-down';

import Menu from './Menu';
import { ClickableContainer, ProfileImage } from './elements';

function UserMenu({ signals, store }) {
  const { user, userMenuOpen } = store;

  return (
    <Relative>
      <ClickableContainer onClick={() => signals.userMenuOpened()}>
        <ProfileImage
          alt={user.username}
          width={35}
          height={35}
          src={user.avatarUrl}
        />

        <ChevronDown css={{ marginLeft: '0.25rem', fontSize: '1.25rem' }} />
      </ClickableContainer>
      {userMenuOpen && (
        <HoverMenu onClose={() => signals.userMenuClosed()}>
          <Menu
            openPreferences={() => {
              signals.modalOpened({ modal: 'preferences' });
            }}
            openStorageManagement={() => {
              signals.files.gotUploadedFiles();
            }}
            signOut={() => {
              signals.signOutClicked();
            }}
            username={user.username}
            curator={user.curatorAt}
            openFeedback={() => {
              signals.modalOpened({ modal: 'feedback' });
            }}
          />
        </HoverMenu>
      )}
    </Relative>
  );
}

export default inject('store', 'signals')(observer(UserMenu));
