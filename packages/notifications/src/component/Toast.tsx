import * as React from 'react';

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

export type IButtonType = React.ComponentType<{
  small?: boolean;
  secondary?: boolean;
  style?: React.CSSProperties;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}>;

export type Props = {
  toast: NotificationToast;
  removeToast: (id: string) => void;
  getRef?: React.LegacyRef<HTMLDivElement>;
  colors: IColors;
  Button: IButtonType;
};

export function Toast({ toast, removeToast, getRef, colors, Button }: Props) {
  const Icon = getIcon(toast.notification.status);
  return (
    <div
      ref={getRef}
      style={{
        display: 'flex',
        backgroundColor: '#141618',
        color: 'white',
        borderRadius: 3,
        position: 'relative',

        width: 450,
        overflow: 'hidden',
        marginBottom: '0.5rem',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: getColor(colors, toast.notification.status),
          width: 4,
        }}
      />
      <div style={{ display: 'flex', padding: '.75rem 1rem', width: '100%' }}>
        <div
          style={{
            color: getColor(colors, toast.notification.status),
            width: 32,
            fontSize: '1.25rem',
            lineHeight:
              toast.notification.message && toast.notification.title
                ? 1.4
                : undefined,
            verticalAlign: 'middle',
          }}
        >
          <Icon />
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  fontSize: '.875rem',
                  fontWeight: 500,
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  marginBottom:
                    toast.notification.title && toast.notification.message
                      ? '.5rem'
                      : 0,
                  lineHeight: 1.6,
                }}
              >
                {toast.notification.title
                  ? toast.notification.title
                  : toast.notification.message}
              </div>

              {toast.notification.title && (
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '.875rem',
                  }}
                >
                  {toast.notification.message}
                </div>
              )}
            </div>

            <div style={{ width: 24 }}>
              <StyledCrossIcon onClick={() => removeToast(toast.id)} />
            </div>
          </div>

          <div>
            {toast.notification.actions && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '.875rem',
                }}
              >
                {toast.notification.actions.primary &&
                  toast.notification.actions.primary[0] && (
                    <Button
                      small
                      onClick={() => {
                        removeToast(toast.id);
                        toast.notification.actions.primary[0].run();
                      }}
                      style={{
                        marginTop: '1rem',
                        marginRight: '0.75rem',
                        lineHeight: 1,
                      }}
                    >
                      {toast.notification.actions.primary[0].label}
                    </Button>
                  )}

                {toast.notification.actions.secondary &&
                  toast.notification.actions.secondary[0] && (
                    <Button
                      secondary
                      small
                      onClick={() => {
                        toast.notification.actions.secondary[0].run();
                      }}
                      style={{
                        marginTop: '1rem',
                        marginLeft: '0.5rem',
                        lineHeight: 1,
                      }}
                    >
                      {toast.notification.actions.secondary[0].label}
                    </Button>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
