import React from 'react';
import { Stack, ThemeProvider } from '@codesandbox/components';
import styled, { keyframes } from 'styled-components';
import { Summary } from './Summary';

export const WorkspaceFlowLayout: React.FC<{
  showSummary: boolean;
  allowSummaryChanges: boolean;
}> = ({ children, showSummary, allowSummaryChanges }) => {
  return (
    <ThemeProvider>
      <Stack
        justify={showSummary ? 'flex-start' : 'center'}
        css={{
          backgroundColor: '#0E0E0E',
          minHeight: '100vh',
          width: '100%',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        }}
      >
        {showSummary && (
          <SlidePanel>
            <Summary allowChanges={allowSummaryChanges} />
          </SlidePanel>
        )}
        <Stack
          css={{
            height: '100%',
            padding: '64px',
          }}
          align="flex-start"
          justify="center"
        >
          {children}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

const slideIn = keyframes`
  0% {
    translate: -100%;
    opacity: 0;
  }

  50% {
    translate: -100%;
  }

  100% {
    translate: 0px;
    opacity: 1;
  }
`;

const SlidePanel = styled.div`
  animation: ${slideIn} 0.25s ease-out;
  background: #242424;
  box-sizing: border-box;
`;
