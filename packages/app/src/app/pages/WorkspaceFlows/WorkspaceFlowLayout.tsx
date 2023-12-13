import React from 'react';
import {
  Element,
  IconButton,
  Stack,
  ThemeProvider,
} from '@codesandbox/components';

export type LayoutProps =
  | {
      canDismiss: true;
      onDismiss: () => void;
    }
  | {
      canDismiss?: false;
      onDismiss?: never;
    };

export const WorkspaceFlowLayout: React.FC<LayoutProps> = ({
  canDismiss,
  onDismiss,
  children,
}) => {
  return (
    <ThemeProvider>
      <Element
        css={{
          backgroundColor: '#0E0E0E',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {canDismiss && (
          <IconButton
            name="cross"
            size={32}
            variant="square"
            css={{ position: 'absolute', top: '16px', right: '16px' }}
            title="Cancel workspace upgrade"
            onClick={onDismiss}
          />
        )}
        <Stack
          css={{
            width: '100vw',
            height: '100%',
            padding: '16px',
          }}
          align="center"
          justify="center"
        >
          {children}
        </Stack>
      </Element>
    </ThemeProvider>
  );
};
