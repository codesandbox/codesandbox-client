import React from 'react';
import {
  ComboButton,
  Button,
  Stack,
  Element,
  Icon,
  Text,
} from '@codesandbox/components';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { useActions } from 'app/overmind';

const GitHubScope: React.FC<{ scope: 'public_repos' | 'private_repos' }> = ({
  scope,
}) => {
  return (
    <Stack as="li" gap={3}>
      <Element css={{ color: '#B3FBB4', marginTop: '2px' }}>
        <Icon name="simpleCheck" />
      </Element>
      <Text
        css={{
          color: '#C5C5C5',
        }}
      >
        {
          {
            public_repos: 'Read and write access to public repositories',
            private_repos: 'Read and write access to private repositories',
          }[scope]
        }
      </Text>
    </Stack>
  );
};

const Details: React.FC = () => {
  const {
    restrictsPublicRepos,
    restrictsPrivateRepos,
    profile,
  } = useGitHuPermissions();
  const { signInGithubClicked, signOutGithubIntegration } = useActions();

  if (restrictsPublicRepos) {
    return (
      <Stack direction="vertical" gap={6}>
        <Stack direction="vertical" gap={0}>
          <Text
            css={{
              marginBottom: '0.25rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.75rem',
            }}
          >
            Enables
          </Text>
          <Text>Committing & Pull Requests</Text>
        </Stack>

        <Stack
          css={{
            color: '#F9D685',
          }}
          gap={2}
        >
          <Icon name="info" size={12} />
          <Text lineHeight="16px" size={12}>
            CodeSandbox needs access to your repositories in order to link
            and/or export a sandbox.
          </Text>
        </Stack>
        <ComboButton
          onClick={() => signInGithubClicked('private_repos')}
          options={
            <>
              <ComboButton.Item
                onSelect={() => signInGithubClicked('private_repos')}
              >
                Autorize access to all repositories{' '}
              </ComboButton.Item>
              <ComboButton.Item
                onSelect={() => signInGithubClicked('public_repos')}
              >
                Autorize access only to public repositories{' '}
              </ComboButton.Item>
            </>
          }
        >
          Autorize access to all repositories{' '}
        </ComboButton>
      </Stack>
    );
  }

  return (
    <Stack css={{ flex: 1 }} direction="vertical" gap={6}>
      <Stack justify="space-between">
        <Stack direction="vertical" gap={0}>
          <Text
            css={{
              marginBottom: '0.25rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.75rem',
            }}
          >
            Signed in as
          </Text>
          <Text>{profile?.email}</Text>
        </Stack>
        <Button
          aria-label="Sign out"
          css={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '1.5rem',
            height: '1.5rem',
            border: '1px solid rgba(255, 0, 0, 0.4)',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: 'rgba(255, 0, 0, 0.6)',
            opacity: '0.8',
            transition: '0.3s ease opacity',
            cursor: 'pointer',

            '&:hover:not(:disabled)': {
              color: 'rgba(255, 0, 0, 0.6)',
              backgroundColor: 'transparent',
              opacity: 1,
            },
          }}
          onClick={signOutGithubIntegration}
        >
          <Icon name="cross" size={12} />
        </Button>
      </Stack>
      <Stack
        as="ul"
        css={{
          margin: 0,
          padding: 0,
        }}
        direction="vertical"
        gap={3}
      >
        <GitHubScope scope="public_repos" />
        {!restrictsPrivateRepos && <GitHubScope scope="private_repos" />}
      </Stack>
      {restrictsPrivateRepos ? (
        <Button
          onClick={() => signInGithubClicked('private_repos')}
          variant="primary"
          autoWidth
        >
          Autorize access to private repositories
        </Button>
      ) : null}
    </Stack>
  );
};

export const GitHubPermissions: React.FC = () => {
  return (
    <Stack
      css={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '4px',
        color: `rgba(255, 255, 255, 0.8)`,
      }}
    >
      <Stack
        align="center"
        justify="center"
        gap={4}
        css={{
          flex: 1,
          background: '#000000',
          color: '#ffffff',
        }}
      >
        <Icon name="github" />
        <Text
          css={{
            lineHeight: '24px',
            letterSpacing: ' -0.01em',
          }}
          size={16}
          weight="500"
        >
          GitHub
        </Text>
      </Stack>
      <Stack
        css={{
          flex: 3,
          padding: '32px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
        gap={4}
        justify="space-between"
      >
        <Details />
      </Stack>
    </Stack>
  );
};
