import { Button, ThemeProvider, Text, Stack } from '@codesandbox/components';
import React from 'react';
import themeType from '@codesandbox/common/lib/theme';

import { withTheme } from 'styled-components';
import { useUpgradeFromV1ToV2 } from 'app/hooks/useUpgradeFromV1ToV2';
import { DevToolProps } from '..';
import { StyledTitle } from './elements';

type StyledProps = DevToolProps & {
  theme: typeof themeType & { light: boolean };
};

export const TerminalUpgradeComponent: React.FC<StyledProps> = ({
  hidden,
  theme,
}) => {
  const { perform, loading, canConvert } = useUpgradeFromV1ToV2('Terminal Tab');

  if (hidden) {
    return null;
  }

  return (
    <ThemeProvider theme={theme.vscodeTheme}>
      <Stack
        direction="vertical"
        css={{
          width: '100%',
        }}
      >
        <StyledTitle>Terminal</StyledTitle>
        <Stack
          direction="vertical"
          css={{
            padding: '1rem',
          }}
          gap={4}
        >
          <Text>
            To use the terminal, you need to upgrade your Browser Sandbox into a
            Cloud Sandbox.
          </Text>
          <Text>
            Cloud Sandboxes are an improved coding experience that run your code
            in the cloud. They allow you to run Docker, code in new languages,
            add servers, databases, and much more. See a preview below.
          </Text>
          <img
            alt="A screenshot of the new cloud sandbox UI"
            src="/static/img/terminal_upgrade_screenshot.png"
          />
          <Text>
            {canConvert
              ? `Do you want to convert it into a Cloud Sandbox?`
              : `Do you want to fork into a Cloud Sandbox?`}
          </Text>
          <Stack
            direction="horizontal"
            gap={4}
            css={{
              justifyContent: 'start',
            }}
          >
            <Button
              onClick={perform}
              loading={loading}
              css={{
                width: 'inherit',
                paddingLeft: '1rem',
                paddingRight: '1rem',
              }}
            >
              Yes, {canConvert ? 'convert' : 'fork and convert'}
            </Button>
            <Button
              as="a"
              variant="link"
              style={{
                width: 'inherit',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                color: 'mutedForeground',
              }}
              target="_blank"
              rel="noreferrer noopener"
              href="https://codesandbox.io/docs/learn/sandboxes/overview?tab=cloud"
            >
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export const terminalUpgrade = {
  id: 'codesandbox.terminalUpgrade',
  title: 'Terminal',
  Content: withTheme(TerminalUpgradeComponent),
  actions: [],
};
