import * as React from 'react';
import { Stack, Element, Text, ButtonProps } from '@codesandbox/components';

import { NotificationToast } from './Toasts';
import { NotificationStatus } from '../state';
import { ErrorIcon } from './icons/ErrorIcon';
import { SuccessIcon } from './icons/SuccessIcon';
import { WarningIcon } from './icons/WarningIcon';
import { InfoIcon } from './icons/InfoIcon';
import {
  StyledCrossIcon,
  Container,
  InnerWrapper,
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

export type IButtonType = React.ComponentType<
  Pick<ButtonProps, 'style' | 'onClick' | 'variant'>
>;

export type Props = {
  toast: NotificationToast;
  removeToast: (id: string) => void;
  getRef?: React.LegacyRef<HTMLDivElement>;
  colors: IColors;
  Button: IButtonType;
};

export function Toast({ toast, removeToast, getRef, colors, Button }: Props) {
  const {
    notification: { actions, title, message, status },
  } = toast;
  const Icon = getIcon(status);
  const fullWidth = { width: '100%' };

  const action = (type: 'primary' | 'secondary') => {
    if (actions) {
      if (Array.isArray(actions[type])) {
        return actions[type][0];
      }

      return actions[type];
    }

    return null;
  };

  return (
    <Container
      // @ts-ignore
      ref={getRef}
      marginBottom={2}
    >
      <InnerWrapper padding={4}>
        <Element style={fullWidth}>
          <Stack style={fullWidth} align="center">
            <Element style={fullWidth}>
              <Stack
                marginBottom={title && message ? 3 : 0}
                align="center"
                gap={2}
              >
                <Stack style={{ color: getColor(colors, status) }}>
                  <Icon />
                </Stack>

                <Text
                  style={{ fontWeight: 500 }}
                  dangerouslySetInnerHTML={{ __html: title || message }}
                />
              </Stack>

              {title && (
                <Text
                  size={3}
                  block
                  dangerouslySetInnerHTML={{ __html: message }}
                />
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
      </InnerWrapper>
    </Container>
  );
}
