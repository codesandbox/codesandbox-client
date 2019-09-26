import Relative from '@codesandbox/common/lib/components/Relative';
import React, { FunctionComponent } from 'react';

import { HoverMenu } from 'app/components/HoverMenu';
import { useOvermind } from 'app/overmind';

import { ClickableContainer, ProfileImage } from './elements';
import { Menu } from './Menu';

export const UserMenu: FunctionComponent = () => {
  const {
    actions: {
      userMenuClosed,
      modalOpened,
      signOutClicked,
      userMenuOpened,
      files: { gotUploadedFiles },
    },
    state: { user, userMenuOpen },
  } = useOvermind();

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
            openPreferences={() =>
              modalOpened({ message: null, modal: 'preferences' })
            }
            openStorageManagement={() => gotUploadedFiles()}
            signOut={() => signOutClicked()}
            username={user.username}
            curator={user.curatorAt}
            openFeedback={() =>
              modalOpened({ message: null, modal: 'feedback' })
            }
          />
        </HoverMenu>
      )}
    </Relative>
  );
};
