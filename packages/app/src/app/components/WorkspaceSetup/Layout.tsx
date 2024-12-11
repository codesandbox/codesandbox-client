import React from 'react';
import { Stack, ThemeProvider } from '@codesandbox/components';
import styled, { keyframes } from 'styled-components';
import { Summary } from './Summary';
import { WorkspaceFlow } from './types';

export const WorkspaceFlowLayout: React.FC<{
  flow: WorkspaceFlow;
  showSummary: boolean;
  allowSummaryChanges: boolean;
}> = ({ children, showSummary, allowSummaryChanges, flow }) => {
  return (
    <ThemeProvider>
      <Stack
        css={{
          backgroundColor: '#0E0E0E',
          width: '100%',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <Stack
          css={{
            maxWidth: '1920px',
            width: '100%',
            minHeight: '100vh',
            margin: 'auto',
            '@media (max-width: 768px)': {
              flexDirection: 'column',
              height: 'auto',
            },
          }}
          justify={showSummary ? 'space-between' : 'center'}
        >
          <Stack
            css={{
              width: '100%',
              height: '100%',
              padding: '64px 0px',
              flex: 1,
              '@media (max-width: 1330px)': {
                padding: '64px 16px',
              },
              '@media (max-width: 768px)': {
                height: 'auto',
              },
            }}
            align="flex-start"
            justify="center"
          >
            {children}
          </Stack>
          {showSummary && (
            <SlidePanel>
              <Summary flow={flow} allowChanges={allowSummaryChanges} />
            </SlidePanel>
          )}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

const slideIn = keyframes`
  0% {
    translate: 100%;
    opacity: 0;
  }

  50% {
    translate: 100%;
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
  flex: 1;
  max-width: 585px;
  @media (max-width: 768px) {
    max-width: initial;
    width: 100%;
  }
`;
