import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import track from '@codesandbox/common/lib/utils/analytics';
import theme from '@codesandbox/components/lib/design-language/theme';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';

import { Container, Link, Select, Text } from './elements';
import { Private, Public, Unlisted } from './icons';

export const PrivacyTooltip: FunctionComponent = () => {
  const {
    actions: {
      workspace: { sandboxPrivacyChanged },
    },
    state: {
      editor: {
        currentSandbox: { owned, privacy },
      },
      user,
    },
  } = useOvermind();

  const config = {
    0: {
      description: 'Everyone can see this Sandbox',
      Icon: Public,
    },
    1: {
      description:
        'Only people with a private link are able to see this Sandbox',
      Icon: Unlisted,
    },
    2: {
      description: 'Only you can see this Sandbox.',
      Icon: Private,
    },
  };

  const onChange = event => {
    const value = event.target.value;
    sandboxPrivacyChanged({
      privacy: Number(value) as 0 | 1 | 2,
      source: 'tooltip',
    });
  };
  const { description, Icon } = config[privacy];

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Tooltip
          content={
            <>
              <Text size="3" marginBottom={4}>
                {owned ? (
                  user?.subscription ? (
                    'Adjust privacy settings.'
                  ) : (
                    <>
                      You can change privacy of a sandbox as a Pro.
                      <br />
                      <Link href="/pricing">Upgrade to Pro</Link>
                    </>
                  )
                ) : (
                  'The author has set privacy to'
                )}
              </Text>

              <Select
                disabled={!user?.subscription || !owned}
                marginBottom={2}
                onChange={onChange}
                value={privacy}
              >
                <option value={0}>Public</option>

                <option value={1}>Unlisted</option>

                <option value={2}>Private</option>
              </Select>

              <Text size="2" color="grays.300">
                {description}
              </Text>
            </>
          }
          delay={0}
          interactive
          onShown={() => track('Sandbox - Open Privacy Tooltip', { owned })}
        >
          <Icon />
        </Tooltip>
      </Container>
    </ThemeProvider>
  );
};
