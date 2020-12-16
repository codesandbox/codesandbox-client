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

import { useOvermind } from 'app/overmind';
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

type MenuItem = ComponentProps<typeof SideNavigation>['menuItems'][0] & {
  Content: ComponentType;
};

const ProfileIcon = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <g clipPath="url(#clip0)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 3.41A.41.41 0 013.41 3h3.68a.41.41 0 01.41.41v9.18a.41.41 0 01-.41.41H3.41a.41.41 0 01-.41-.41V3.41zm5.5 0A.41.41 0 018.91 3h3.68a.41.41 0 01.41.41v2.68a.41.41 0 01-.41.41H8.91a.41.41 0 01-.41-.41V3.41zm.41 4.09a.41.41 0 00-.41.41v4.68c0 .227.183.41.41.41h3.68a.41.41 0 00.41-.41V7.91a.41.41 0 00-.41-.41H8.91z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill="#fff" d="M0 0H16V16H0z" />
      </clipPath>
    </defs>
  </svg>
);

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
      title: 'Preferece Profiles',
    },
  ].filter(Boolean);

export const PreferencesModal: FunctionComponent = () => {
  const {
    state: {
      isLoggedIn,
      isPatron,
      user,
      preferences: { itemId = 'appearance' },
    },
  } = useOvermind();
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
