import * as React from 'react';
import { Button, Stack, Element, Text } from '@codesandbox/components';

import { NotificationToast } from './Toasts';
import { NotificationStatus } from '../state';
import { ErrorIcon } from './icons/ErrorIcon';
import { SuccessIcon } from './icons/SuccessIcon';
import { WarningIcon } from './icons/WarningIcon';
import { InfoIcon } from './icons/InfoIcon';
import {
  StyledCrossIcon,
  Container,
  ColorLine,
  TertiaryButton,
} from './elements';

const getColor = (colors: IColors, status: NotificationStatus) =>
  colors[status];

const getIcon = (status: NotificationStatus) => {
  switch (status) {
    case NotificationStatus.ERROR:
      return ErrorIcon;
    case NotificationStatus.WARNING:
      return WarningIcon;
    case NotificationStatus.SUCCESS:
      return SuccessIcon;
    case NotificationStatus.NOTICE:
      return InfoIcon;
    default:
      return InfoIcon;
  }
};

export interface IColors {
  [NotificationStatus.ERROR]: string;
  [NotificationStatus.WARNING]: string;
  [NotificationStatus.SUCCESS]: string;
  [NotificationStatus.NOTICE]: string;
}

export type Props = {
  toast: NotificationToast;
  removeToast: (id: string) => void;
  getRef?: React.LegacyRef<HTMLDivElement>;
  colors: IColors;
};

export function Toast({ toast, removeToast, getRef, colors }: Props) {
  const {
    notification: { actions, title, message, status },
  } = toast;
  const Icon = getIcon(status);
  const fullWidth = { width: '100%' };

  const action = (type: 'primary' | 'secondary') => {
    if (actions) {
      return Array.isArray(actions[type]) ? actions[type][0] : actions[type];
    }

    return null;
  };

  if (
    actions &&
    (Array.isArray(actions.primary) || Array.isArray(actions.secondary))
  ) {
    console.error(
      `Please update the "${title ||
        message}" notification, it still uses arrays`
    );
  }
  return (
    <Container
      // @ts-ignore
      ref={getRef}
      marginBottom={2}
    >
      <ColorLine bg={getColor(colors, status)} />
      <Stack style={fullWidth} paddingX={3} paddingY={4}>
        <Element style={fullWidth}>
          <Stack style={fullWidth}>
            <Element style={fullWidth}>
              <Stack
                marginBottom={title && message ? 3 : 0}
                align="center"
                gap={2}
              >
                <Icon />
                <Text
                  style={{
                    fontWeight: 500,
                  }}
                >
                  {title || message}
                </Text>
              </Stack>

              {title && (
                <Text size={3} block>
                  {message}
                </Text>
              )}
            </Element>

            <StyledCrossIcon onClick={() => removeToast(toast.id)} />
          </Stack>

          <Element>
            {actions && (
              <Stack marginTop={3} gap={2} justify="flex-end">
                {action('secondary') && (
                  <TertiaryButton
                    variant="secondary"
                    onClick={() => {
                      if (action('secondary').hideOnClick) {
                        removeToast(toast.id);
                      }
                      action('secondary').run();
                    }}
                  >
                    {action('secondary').label}
                  </TertiaryButton>
                )}
                {action('primary') && (
                  <Button
                    variant="secondary"
                    style={{
                      width: 'auto',
                    }}
                    onClick={() => {
                      // By default we hide the notification on clicking action("primary") buttons
                      if (action('primary').hideOnClick !== false) {
                        removeToast(toast.id);
                      }
                      action('primary').run();
                    }}
                  >
                    {action('primary').label}
                  </Button>
                )}
              </Stack>
            )}
          </Element>
        </Element>
      </Stack>
    </Container>
  );
}
