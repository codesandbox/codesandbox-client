import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React, { useMemo } from 'react';
import { FaCode, FaFlask, FaOutdent } from 'react-icons/fa';
import { GoBrowser, GoKeyboard, GoStar } from 'react-icons/go';
import { MdColorLens, MdCreditCard, MdDeviceHub } from 'react-icons/md';

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

const PreferencesModal: React.FC = () => {
  const {
    state: {
      isPatron,
      isLoggedIn,
      preferences: { itemId = 'appearance' },
    },
    actions: {
      preferences: { itemIdChanged },
    },
  } = useOvermind();

  const items = useMemo(
    () =>
      [
        {
          id: 'appearance',
          title: 'Appearance',
          icon: <MdColorLens />,
          content: <Appearance />,
        },
        {
          id: 'editor',
          title: 'Editor',
          icon: <FaCode />,
          content: <EditorSettings />,
        },
        {
          id: 'prettierSettings',
          title: 'Prettier Settings',
          icon: <FaOutdent />,
          content: <CodeFormatting />,
        },
        {
          id: 'preview',
          title: 'Preview',
          icon: <GoBrowser />,
          content: <PreviewSettings />,
        },
        {
          id: 'keybindings',
          title: 'Key Bindings',
          icon: <GoKeyboard />,
          content: <KeyMapping />,
        },
        isLoggedIn && {
          id: 'integrations',
          title: 'Integrations',
          icon: <MdDeviceHub />,
          content: <Integrations />,
        },
        isPatron && {
          id: 'paymentInfo',
          title: 'Payment Info',
          icon: <MdCreditCard />,
          content: <PaymentInfo />,
        },
        isPatron && {
          id: 'badges',
          title: 'Badges',
          icon: <GoStar />,
          content: <Badges />,
        },
        {
          id: 'experiments',
          title: 'Experiments',
          icon: <FaFlask />,
          content: <Experiments />,
        },
      ].filter(Boolean),
    [isLoggedIn, isPatron]
  );

  const item = items.find(currentItem => currentItem.id === itemId);

  return (
    <Stack
      css={css({
        fontFamily: "'Inter', sans-serif",
      })}
    >
      <SideNavigation
        itemId={itemId}
        menuItems={items}
        setItem={itemIdChanged}
      />
      <Alert
        css={css({
          height: 482,
          width: '100%',
          padding: 6,
          '*': {
            boxSizing: 'border-box',
          },
        })}
      >
        {item.content}
      </Alert>
    </Stack>
  );
};

export default PreferencesModal;
