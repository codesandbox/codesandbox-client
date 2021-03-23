import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { ComponentProps, ComponentType, FunctionComponent } from 'react';

import CodeIcon from 'react-icons/lib/fa/code';
import CodeFormatIcon from 'react-icons/lib/fa/dedent';
import FlaskIcon from 'react-icons/lib/fa/flask';
import MailIcon from 'react-icons/lib/go/mail';
import BrowserIcon from 'react-icons/lib/go/browser';
import KeyboardIcon from 'react-icons/lib/go/keyboard';
import StarIcon from 'react-icons/lib/go/star';
import AppearanceIcon from 'react-icons/lib/md/color-lens';
import CreditCardIcon from 'react-icons/lib/md/credit-card';
import IntegrationIcon from 'react-icons/lib/md/device-hub';

import { useAppState } from 'app/overmind';
import { CurrentUser } from '@codesandbox/common/lib/types';

import { Alert } from '../Common/Alert';

import { Appearance } from './Appearance';
import { Badges } from './Badges';
import { CodeFormatting } from './CodeFormatting';
import { EditorSettings } from './EditorPageSettings/EditorSettings';
import { PreviewSettings } from './EditorPageSettings/PreviewSettings';
import { Experiments } from './Experiments';
import { PreferencesSync } from './PreferencesSync';
import { Integrations } from './Integrations';
import { KeyMapping } from './KeyMapping';
import { PaymentInfo } from './PaymentInfo';
import { MailPreferences } from './MailPreferences';

import { SideNavigation } from './SideNavigation';
import { ProfileIcon } from './PreferencesSync/Icons';

type MenuItem = ComponentProps<typeof SideNavigation>['menuItems'][0] & {
  Content: ComponentType;
};

const getItems = (
  isLoggedIn: boolean,
  isPatron: boolean,
  user: CurrentUser
): MenuItem[] =>
  [
    {
      Content: Appearance,
      Icon: AppearanceIcon,
      id: 'appearance',
      title: 'Appearance',
    },
    {
      Content: EditorSettings,
      Icon: CodeIcon,
      id: 'editor',
      title: 'Editor',
    },
    {
      Content: CodeFormatting,
      Icon: CodeFormatIcon,
      id: 'prettierSettings',
      title: 'Prettier Settings',
    },
    {
      Content: PreviewSettings,
      Icon: BrowserIcon,
      id: 'preview',
      title: 'Preview',
    },
    {
      Content: KeyMapping,
      Icon: KeyboardIcon,
      id: 'keybindings',
      title: 'Key Bindings',
    },
    isLoggedIn && {
      Content: Integrations,
      Icon: IntegrationIcon,
      id: 'integrations',
      title: 'Integrations',
    },
    isPatron && {
      Content: PaymentInfo,
      Icon: CreditCardIcon,
      id: 'paymentInfo',
      title: 'Payment Info',
    },
    isPatron && {
      Content: Badges,
      Icon: StarIcon,
      id: 'badges',
      title: 'Badges',
    },
    user &&
      user.experiments.inPilot && {
        Content: MailPreferences,
        Icon: MailIcon,
        id: 'emailSettings',
        title: 'Email Settings',
      },
    {
      Content: Experiments,
      Icon: FlaskIcon,
      id: 'experiments',
      title: 'Experiments',
    },
    user && {
      Content: PreferencesSync,
      Icon: ProfileIcon,
      id: 'preferencesSync',
      title: 'Preferences Profiles',
    },
  ].filter(Boolean);

export const PreferencesModal: FunctionComponent = () => {
  const {
    isLoggedIn,
    isPatron,
    user,
    preferences: { itemId = 'appearance' },
  } = useAppState();
  const items = getItems(isLoggedIn, isPatron, user);
  const { Content } = items.find(({ id }) => id === itemId);

  return (
    <Stack css={css({ fontFamily: "'Inter', sans-serif" })}>
      <SideNavigation menuItems={items} />

      <Alert
        css={css({
          height: 482,
          width: '100%',
          padding: 6,
          '*': { boxSizing: 'border-box' },
        })}
      >
        <Content />
      </Alert>
    </Stack>
  );
};
