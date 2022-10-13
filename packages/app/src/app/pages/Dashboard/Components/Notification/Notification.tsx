import React, { useState } from 'react';
import { css } from 'styled-components';
import { useEffects } from 'app/overmind';
import { Element, Text, IconButton, Stack } from '@codesandbox/components';

import { PageTypes } from '../../types';
import { GUTTER, GRID_MAX_WIDTH } from '../VariableGrid';
import { NotificationIndicator } from './NotificationIndicator';

interface NotificationProps {
  children: React.ReactNode;
  pageType: PageTypes;
}

export const Notification = ({ children, pageType }: NotificationProps) => {
  const { browser } = useEffects();
  const [isShown, setIsShown] = useState(() => {
    return !browser.storage.get('notificationDismissed')?.[pageType];
  });

  const dismissNotification = () => {
    // Get previously dismissed notifications
    const prevDismissedNotifications = browser.storage.get(
      'notificationDismissed'
    ) as object;

    // Add notification to dismissed
    browser.storage.set('notificationDismissed', {
      ...prevDismissedNotifications,
      [pageType]: true,
    });

    setIsShown(false);
  };

  if (isShown)
    return (
      <Element
        paddingX={4}
        paddingY={2}
        marginTop={8}
        css={{
          width: `calc(100% - ${2 * GUTTER}px)`,
          maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        }}
      >
        <Stack gap={4} align="center">
          <NotificationIndicator />
          <Text size={12} css={css({ lineHeight: '16px', color: '#C2C2C2' })}>
            {children}
          </Text>
          <Element
            css={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}
          >
            <IconButton
              name="cross"
              variant="round"
              title="Dismiss notification"
              onClick={dismissNotification}
            />
          </Element>
        </Stack>
      </Element>
    );

  return null;
};
