import * as React from 'react';
import Relative from '@codesandbox/common/lib/components/Relative';
import { inject, hooksObserver } from 'app/componentConnectors';
import { HoverMenu } from 'app/components/HoverMenu';
import Menu from './Menu';
import { ClickableContainer, ProfileImage } from './elements';

const UserMenu = inject('store', 'signals')(
  hooksObserver(
    ({
      store: { user, userMenuOpen },
      signals: {
        userMenuClosed,
        modalOpened,
        signOutClicked,
        userMenuOpened,
        files,
      },
    }) => (
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
              openStorageManagement={files.gotUploadedFiles}
              signOut={signOutClicked}
              username={user.username}
              curator={user.curatorAt}
              openFeedback={() => modalOpened({ modal: 'feedback' })}
            />
          </HoverMenu>
        )}
      </Relative>
    )
  )
);

export default UserMenu;
