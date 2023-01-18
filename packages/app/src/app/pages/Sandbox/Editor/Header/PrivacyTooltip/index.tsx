import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import track from '@codesandbox/common/lib/utils/analytics';
import theme from '@codesandbox/components/lib/design-language/theme';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState, useActions } from 'app/overmind';
import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { Container, Link, Select, Text, Button } from './elements';
import { Private, Public, Unlisted } from './icons';

export const PrivacyTooltip: FunctionComponent = () => {
  const { sandboxPrivacyChanged } = useActions().workspace;
  const {
    editor: {
      currentSandbox: { owned, privacy },
    },
  } = useAppState();
  const { isPro, isFree } = useWorkspaceSubscription();
  const [privacyValue, setPrivacyValue] = useState<0 | 1 | 2>(privacy);

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

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value) as 0 | 1 | 2;

    if (isPro) {
      sandboxPrivacyChanged({ privacy: value, source: 'tooltip' });
    }

    setPrivacyValue(value);
  };

  const setPrivacyToPublic = () => {
    sandboxPrivacyChanged({ privacy: 0, source: 'tooltip' });
  };

  const { description, Icon } = config[privacy];

  const Owned = () =>
    isPro ? (
      <>Adjust privacy settings.</>
    ) : (
      <Text color="grays.300">
        This sandbox is currently restricted.{' '}
        <Link href="/pro">Upgrade to Pro</Link> or make it public to edit.
      </Text>
    );

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Tooltip
          visible // 🚧 DEBUG
          content={
            <>
              <Text size="3" marginBottom={3}>
                {owned ? <Owned /> : 'The author has set privacy to'}
              </Text>

              {isFree ? (
                <Button type="button" onClick={setPrivacyToPublic}>
                  Make sandbox public
                </Button>
              ) : null}

              <Text
                as="label"
                htmlFor="privacy-select"
                size="3"
                color="grays.300"
                css={{
                  display: 'block',
                  marginBottom: '4px',
                  marginTop: '24px',
                }}
              >
                Privacy
              </Text>

              <Select
                id="privacy-select"
                disabled={!owned || !isPro}
                onChange={onChange}
                value={privacyValue}
              >
                <option value={0}>Public</option>

                <option value={1} disabled={isFree}>
                  Unlisted
                </option>

                <option value={2} disabled={isFree}>
                  Private
                </option>
              </Select>

              <Text css={{ paddingTop: '8px' }} size="2" color="grays.300">
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
