import { useAppState, useActions } from 'app/overmind';
import React from 'react';
import {
  Text,
  Element,
  Stack,
  Button,
  Collapsible,
  Icon,
} from '@codesandbox/components';

export const GithubLogin = () => {
  const { signInGithubClicked } = useActions();
  const {
    isLoadingGithub,
    editor: {
      currentSandbox: { privacy },
    },
  } = useAppState();

  const privacyLabel = {
    0: 'public',
    1: 'unlisted',
    2: 'private',
  }[privacy];

  return (
    <Collapsible title="Adjust GitHub permissions" defaultOpen>
      <Stack css={{ padding: '0 12px' }} direction="vertical" gap={4}>
        <Stack
          css={{
            color: '#F9D685',
          }}
          gap={2}
        >
          <Element
            css={{
              marginTop: '2px', // Visually align with the Text
            }}
          >
            <Icon name="info" size={12} />
          </Element>
          <Text lineHeight="16px" size={12}>
            CodeSandbox needs access to your{' '}
            {privacy === 0 ? 'public' : 'private'} repositories in order to link
            and/or export {privacyLabel === 'unlisted' ? 'an' : 'a'}{' '}
            {privacyLabel} sandbox.
          </Text>
        </Stack>
        <Button
          loading={isLoadingGithub}
          onClick={() =>
            signInGithubClicked(
              privacy === 0 ? 'public_repos' : 'private_repos'
            )
          }
        >
          Review GitHub permissions
        </Button>
      </Stack>
    </Collapsible>
  );
};
