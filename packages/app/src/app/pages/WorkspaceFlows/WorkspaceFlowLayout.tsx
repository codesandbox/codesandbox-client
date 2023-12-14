import React from 'react';
import {
  Element,
  IconButton,
  Stack,
  ThemeProvider,
} from '@codesandbox/components';

export type LayoutProps = {
  currentStep: number;
  onPrevStep: () => void;
  onDismiss: () => void;
};

export const WorkspaceFlowLayout: React.FC<LayoutProps> = ({
  onDismiss,
  currentStep,
  onPrevStep,
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
        {currentStep > 0 && (
          <IconButton
            name="backArrow"
            size={16}
            variant="square"
            css={{ position: 'absolute', top: '16px', left: '16px' }}
            title="Go back"
            onClick={onPrevStep}
          />
        )}
        {onDismiss && (
          <IconButton
            name="cross"
            size={16}
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
