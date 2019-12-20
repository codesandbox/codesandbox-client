import React from 'react';
import { useOvermind } from 'app/overmind';
import {
  ChatIcon,
  CogIcon,
  CuratorIcon,
  DashboardIcon,
  DocumentationIcon,
  ExitIcon,
  FolderIcon,
  PatronIcon,
  ProIcon,
  SearchIcon,
  UserIcon,
} from '@codesandbox/common/lib/components/icons';
import { Menu, MenuItem, Separator } from '@codesandbox/common/lib/components/Menu';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  profileUrl,
  patronUrl,
  curatorUrl,
  dashboardUrl,
  searchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Avatar } from './elements';

interface IUserMenuProps {}

export const UserMenu: React.FC<IUserMenuProps> = () => {
  const {
    actions: {
      modalOpened,
      signOutClicked,
      files: { gotUploadedFiles },
    },
    state: { user },
  } = useOvermind();

  return (
    <Avatar
      as={Menu}
      aria-label="User Menu"
      name={user.username}
      img={user.avatarUrl}
      onOpen={track('User Menu Open')}
    >
      <MenuItem icon={UserIcon} to={profileUrl(user.username)}>
        My Profile
      </MenuItem>
      <Separator />
      <MenuItem icon={DashboardIcon} to={dashboardUrl()}>
        Dashboard
      </MenuItem>
      <MenuItem icon={DocumentationIcon} to="/docs">
        Documentation
      </MenuItem>
      <MenuItem icon={SearchIcon} to={searchUrl()}>
        Search Sandboxes
      </MenuItem>
      {user.curatorAt && (
        <MenuItem icon={CuratorIcon} to={curatorUrl()}>
          Curator Dashboard
        </MenuItem>
      )}
      {user.subscription && user.subscription.plan === 'patron' && (
        <MenuItem icon={PatronIcon} to={patronUrl()}>
          Patron Page
        </MenuItem>
      )}
      {!user.subscription && (
        <MenuItem icon={ProIcon} to="/pricing">
          Upgrade to Pro
        </MenuItem>
      )}
      <Separator />
      {user.subscription && user.subscription.plan === 'pro' && (
        <MenuItem icon={ProIcon} to="/pro">
          Manage Subscription
        </MenuItem>
      )}
      <MenuItem icon={FolderIcon} onClick={() => gotUploadedFiles(null)}>
        Storage Management
      </MenuItem>
      <MenuItem
        icon={CogIcon}
        onClick={() => modalOpened({ modal: 'preferences' })}
      >
        Preferences
      </MenuItem>
      <Separator />
      <MenuItem
        icon={ChatIcon}
        onClick={() => modalOpened({ modal: 'feedback' })}
      >
        Submit Feedback
      </MenuItem>
      <Separator />
      <MenuItem icon={ExitIcon} onClick={() => signOutClicked()}>
        Sign Out
      </MenuItem>
    </Avatar>
  );
};
