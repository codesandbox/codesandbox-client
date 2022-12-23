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

  const handlePrivacyChange = () => {
    sandboxPrivacyChanged({ privacy: privacyValue, source: 'tooltip' });
  };

  const { description, Icon } = config[privacy];

  const Owned = () =>
    isPro ? (
      <>Adjust privacy settings.</>
    ) : (
      <Text color="grays.300">
        You can only change the privacy of a sandbox to public.{' '}
        <Link href="/pro">Upgrade to Pro</Link> for more options.
      </Text>
    );

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Tooltip
          // visible // 🚧 DEBUG
          content={
            <>
              <Text size="3" marginBottom={4}>
                {owned ? <Owned /> : 'The author has set privacy to'}
              </Text>

              <Text
                as="label"
                htmlFor="privacy-select"
                size="3"
                color="grays.300"
                css={{ display: 'block', marginBottom: '4px' }}
              >
                Privacy
              </Text>

              <Select
                id="privacy-select"
                disabled={!owned}
                marginBottom={2}
                onChange={onChange}
                value={privacy}
              >
                <option value={0}>Public</option>

                <option value={1} disabled={isFree}>
                  Unlisted
                </option>

                <option value={2} disabled={isFree}>
                  Private
                </option>
              </Select>

              {/* TODO form submit */}
              {isFree ? (
                <Button type="button" onClick={handlePrivacyChange}>
                  Chance privacy
                </Button>
              ) : null}

              <Text css={{ paddingTop: '12px' }} size="2" color="grays.300">
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
