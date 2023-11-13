import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { ComponentProps, ComponentType, FunctionComponent } from 'react';

import AccountIcon from 'react-icons/lib/fa/user';
import CodeIcon from 'react-icons/lib/fa/code';
import CodeFormatIcon from 'react-icons/lib/fa/dedent';
import FlaskIcon from 'react-icons/lib/fa/flask';
import MailIcon from 'react-icons/lib/go/mail';
import BrowserIcon from 'react-icons/lib/go/browser';
import AppearanceIcon from 'react-icons/lib/md/color-lens';
import IntegrationIcon from 'react-icons/lib/md/device-hub';

import { useAppState } from 'app/overmind';
import { useIsEditorPage } from 'app/hooks/useIsEditorPage';
import { CurrentUser } from '@codesandbox/common/lib/types';

import { Alert } from '../Common/Alert';

import { Account } from './Account';
import { Appearance } from './Appearance';
import { CodeFormatting } from './CodeFormatting';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { Experiments } from './Experiments';
import { PreferencesSync } from './PreferencesSync';
import { Integrations } from './Integrations';
import { MailPreferences } from './MailPreferences';

import { SideNavigation } from './SideNavigation';
import { ProfileIcon } from './PreferencesSync/Icons';

type MenuItem = ComponentProps<typeof SideNavigation>['menuItems'][0] & {
  Content: ComponentType;
};

const getItems = (
  isLoggedIn: boolean,
  user: CurrentUser,
  isOnPrem: boolean,
  isEditorPage: boolean
): MenuItem[] =>
  [
    user && {
      Content: Account,
      Icon: AccountIcon,
      id: 'account',
      title: 'Account',
    },
    isLoggedIn &&
      !isOnPrem && {
        Content: Integrations,
        Icon: IntegrationIcon,
        id: 'integrations',
        title: 'Integrations',
      },
    user && {
      Content: MailPreferences,
      Icon: MailIcon,
      id: 'notifications',
      title: 'Notifications',
    },
    !isOnPrem && {
      Content: Experiments,
      Icon: FlaskIcon,
      id: 'experiments',
      title: 'Experiments',
    },
    isEditorPage && {
      Content: Appearance,
      Icon: AppearanceIcon,
      id: 'appearance',
      title: 'Appearance',
    },
    isEditorPage && {
      Content: Editor,
      Icon: CodeIcon,
      id: 'editor',
      title: 'Editor',
    },
    isEditorPage && {
      Content: CodeFormatting,
      Icon: CodeFormatIcon,
      id: 'prettierSettings',
      title: 'Prettier Settings',
    },
    isEditorPage && {
      Content: Preview,
      Icon: BrowserIcon,
      id: 'preview',
      title: 'Preview',
    },
    isEditorPage &&
      user && {
        Content: PreferencesSync,
        Icon: ProfileIcon,
        id: 'preferencesSync',
        title: 'Profiles',
      },
  ].filter(Boolean);

export const PreferencesModal: FunctionComponent = () => {
  const {
    isLoggedIn,
    user,
    preferences: { itemId = 'account' },
    environment,
  } = useAppState();

  const isEditorPage = useIsEditorPage();
  const items = getItems(isLoggedIn, user, environment.isOnPrem, isEditorPage);

  const tabToShow = items.find(({ id }) => id === itemId) || items[0];
  const { Content } = tabToShow;

  return (
    <Stack css={css({ fontFamily: "'Inter', sans-serif" })}>
      <SideNavigation menuItems={items} />

      <Alert
        css={css({
          height: 482,
          width: '100%',
          padding: 6,
          marginTop: 52,
          '*': { boxSizing: 'border-box' },
        })}
      >
        <Content />
      </Alert>
    </Stack>
  );
};
