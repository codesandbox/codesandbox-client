import * as React from 'react';
import { Button, Stack, Element, Text } from '@codesandbox/components';
import theme from '@codesandbox/components/lib/design-language/theme';

import { NotificationToast } from './Toasts';
import { NotificationStatus } from '../state';
import { ErrorIcon } from './icons/ErrorIcon';
import { SuccessIcon } from './icons/SuccessIcon';
import { WarningIcon } from './icons/WarningIcon';
import { InfoIcon } from './icons/InfoIcon';
import { StyledCrossIcon } from './elements';

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
  return (
    <Stack
      // @ts-ignore
      ref={getRef}
      marginBottom={2}
      style={{
        background: theme.colors.grays[700],
        border: `1px solid ${theme.colors.grays[600]}`,
        boxSizing: 'border-box',
        boxShadow: theme.shadows[2],
        borderRadius: theme.radii.medium,
        position: 'relative',
        fontSize: theme.fontSizes[3],
        color: theme.colors.white,
        width: 450,
        overflow: 'hidden',
      }}
    >
      <Element
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: getColor(colors, status),
          width: 4,
        }}
      />
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
              <Stack marginTop={3} gap={2}>
                {actions.primary && (
                  <Button
                    variant="secondary"
                    style={{
                      width: 'auto',
                      background: !actions.secondary
                        ? theme.colors.grays[600]
                        : 'transparent',
                      border: !actions.secondary
                        ? 'none'
                        : `1px solid ${theme.colors.grays[600]}`,
                    }}
                    onClick={() => {
                      // By default we hide the notification on clicking primary buttons
                      if (actions.primary.hideOnClick !== false) {
                        removeToast(toast.id);
                      }
                      actions.primary.run();
                    }}
                  >
                    {actions.primary.title}
                  </Button>
                )}

                {actions.secondary && (
                  <Button
                    style={{ width: 'auto' }}
                    variant="secondary"
                    onClick={() => {
                      if (actions.secondary.hideOnClick) {
                        removeToast(toast.id);
                      }
                      actions.secondary.run();
                    }}
                  >
                    {actions.secondary.title}
                  </Button>
                )}
              </Stack>
            )}
          </Element>
        </Element>
      </Stack>
    </Stack>
  );
}
