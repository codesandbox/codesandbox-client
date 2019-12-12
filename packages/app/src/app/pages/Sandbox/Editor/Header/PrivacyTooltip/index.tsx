import React from 'react';
import { useOvermind } from 'app/overmind';
import { ThemeProvider } from 'styled-components';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import theme from '@codesandbox/common/lib/design-language/theme';
import { Container, Text, Link, Select } from './elements';
import * as Icons from './icons';

export const PrivacyTooltip = () => {
  const {
    actions: {
      workspace: { sandboxPrivacyChanged },
    },
    state: {
      user: { subscription },
      editor: {
        currentSandbox: { privacy },
      },
    },
  } = useOvermind();

  const config = {
    0: {
      description: 'Everyone can see this Sandbox',
      icon: <Icons.Public />,
    },
    1: {
      description:
        'Only people with a private link are able to see this Sandbox',
      icon: <Icons.Unlisted />,
    },
    2: {
      description: 'Only you can see this Sandbox.',
      icon: <Icons.Private />,
    },
  };

  const onChange = event => {
    const value = event.target.value;
    sandboxPrivacyChanged(Number(value) as 0 | 1 | 2);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Tooltip
          delay={0}
          interactive
          content={
            <>
              <Text size="3" marginBottom={4}>
                {subscription ? (
                  'Adjust privacy settings.'
                ) : (
                  <>
                    You can change privacy of a sandbox as a Pro.
                    <br />
                    <Link href="/pricing">Upgrade to Pro</Link>
                  </>
                )}
              </Text>

              <Select
                marginBottom={2}
                value={privacy}
                onChange={onChange}
                disabled={!subscription}
              >
                <option value={0}>Public</option>
                <option value={1}>Unlisted</option>
                <option value={2}>Private</option>
              </Select>
              <Text size="2" color="grays.300">
                {config[privacy].description}
              </Text>
            </>
          }
        >
          {config[privacy].icon}
        </Tooltip>
      </Container>
    </ThemeProvider>
  );
};
