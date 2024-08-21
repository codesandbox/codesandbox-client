import { Stack, Element } from '@codesandbox/components';
import React, { ComponentProps, ComponentType } from 'react';

import AccountIcon from 'react-icons/lib/fa/user';
import FlaskIcon from 'react-icons/lib/fa/flask';
import MailIcon from 'react-icons/lib/go/mail';
import IntegrationIcon from 'react-icons/lib/md/device-hub';

import { useAppState } from 'app/overmind';
import { CurrentUser } from '@codesandbox/common/lib/types';

import { Account } from './Account';
import { Experiments } from './Experiments';
import { Integrations } from './Integrations';
import { MailPreferences } from './MailPreferences';

import { SideNavigation } from './SideNavigation';

type MenuItem = ComponentProps<typeof SideNavigation>['menuItems'][0] & {
  Content: ComponentType;
};

const getItems = (
  isLoggedIn: boolean,
  user: CurrentUser,
  isOnPrem: boolean
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
  ].filter(Boolean);

export const Preferences: React.FC<{
  tab?: string;
  isStandalone?: boolean;
}> = ({ tab, isStandalone }) => {
  const {
    isLoggedIn,
    user,
    preferences: { itemId },
    environment,
  } = useAppState();

  const items = getItems(isLoggedIn, user, environment.isOnPrem);

  const tabId = itemId || tab || 'account';

  const tabToShow = items.find(({ id }) => id === tabId) || items[0];
  const { Content } = tabToShow;

  return (
    <Stack>
      <SideNavigation menuItems={items} selectedTab={tabId} />

      <Element
        css={{
          height: isStandalone ? 'auto' : '482px',
          width: '100%',
          padding: '24px',
          marginTop: '52px',
          overflow: 'auto',
        }}
      >
        <Content />
      </Element>
    </Stack>
  );
};
