import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { ComponentProps, ComponentType, FunctionComponent } from 'react';

import CodeIcon from 'react-icons/lib/fa/code';
import CodeFormatIcon from 'react-icons/lib/fa/dedent';
import FlaskIcon from 'react-icons/lib/fa/flask';
import BrowserIcon from 'react-icons/lib/go/browser';
import KeyboardIcon from 'react-icons/lib/go/keyboard';
import StarIcon from 'react-icons/lib/go/star';
import AppearanceIcon from 'react-icons/lib/md/color-lens';
import CreditCardIcon from 'react-icons/lib/md/credit-card';
import IntegrationIcon from 'react-icons/lib/md/device-hub';

import { useOvermind } from 'app/overmind';

import { Alert } from '../Common/Alert';

import { Appearance } from './Appearance';
import { Badges } from './Badges';
import { CodeFormatting } from './CodeFormatting';
import { EditorSettings } from './EditorPageSettings/EditorSettings';
import { PreviewSettings } from './EditorPageSettings/PreviewSettings';
import { Experiments } from './Experiments';
import { Integrations } from './Integrations';
import { KeyMapping } from './KeyMapping';
import { PaymentInfo } from './PaymentInfo';
import { SideNavigation } from './SideNavigation';

type MenuItem = ComponentProps<typeof SideNavigation>['menuItems'][0] & {
  Content: ComponentType;
};
const getItems = (isLoggedIn: boolean, isPatron: boolean): MenuItem[] =>
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
    {
      Content: Experiments,
      Icon: FlaskIcon,
      id: 'experiments',
      title: 'Experiments',
    },
  ].filter(Boolean);

export const PreferencesModal: FunctionComponent = () => {
  const {
    state: {
      isLoggedIn,
      isPatron,
      preferences: { itemId = 'appearance' },
    },
  } = useOvermind();
  const items = getItems(isLoggedIn, isPatron);
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
