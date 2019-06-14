import * as React from 'react';
import { observer } from 'mobx-react-lite';

import HoverMenu from 'app/components/HoverMenu';
import Relative from '@codesandbox/common/lib/components/Relative';
import { useSignals, useStore } from 'app/store';

import Menu from './Menu';
import { ClickableContainer, ProfileImage } from './elements';

function UserMenu() {
  const { user, userMenuOpen } = useStore();
  const {
    userMenuClosed,
    modalOpened,
    signOutClicked,
    userMenuOpened,
    files,
  } = useSignals();

  return (
    <Relative>
      <ClickableContainer onClick={userMenuOpened}>
        <ProfileImage
          alt={user.username}
          width={30}
          height={30}
          src={user.avatarUrl}
        />
      </ClickableContainer>
      {userMenuOpen && (
        <HoverMenu onClose={() => userMenuClosed()}>
          <Menu
            openPreferences={() => modalOpened({ modal: 'preferences' })}
            openStorageManagement={files.gotUploadedFiles()}
            signOut={signOutClicked()}
            username={user.username}
            curator={user.curatorAt}
            openFeedback={() => modalOpened({ modal: 'feedback' })}
          />
        </HoverMenu>
      )}
    </Relative>
  );
}

export default observer(UserMenu);
