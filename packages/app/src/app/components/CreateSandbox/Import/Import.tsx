import track from '@codesandbox/common/lib/utils/analytics';
import { Button, Element, Input, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { GithubRepoAuthorization } from 'app/graphql/types';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';

import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { GithubRepoToImport } from './types';
import { useGithubRepo } from './useGithubRepo';
import { getOwnerAndRepoFromInput } from './utils';
import { MaxPublicRepos, PrivateRepoFreeTeam } from './importLimits';

const UnauthenticatedImport: React.FC = () => {
  const actions = useActions();

  return (
    <Stack direction="vertical" gap={4}>
      <Text
        as="h2"
        css={{ margin: 0, lineHeight: '24px' }}
        size={4}
        weight="medium"
      >
        Import from GitHub
      </Text>
      <Stack direction="vertical" gap={4}>
        <Text id="unauthenticated-label" css={{ color: '#999999' }} size={3}>
          You need to sign in to import repositories from GitHub.
        </Text>
        <Button
          aria-describedby="unauthenticated-label"
          css={{
            width: '132px',
          }}
          onClick={() => actions.signInClicked()}
          variant="primary"
        >
          Sign in
        </Button>
      </Stack>
    </Stack>
  );
};

type UrlState = {
  raw: string;
  parsed: { owner: string; name: string } | null;
  error: string | null;
};

type ImportProps = {
  onRepoSelect: (repo: GithubRepoToImport) => void;
};
export const Import: React.FC<ImportProps> = ({ onRepoSelect }) => {
  const { hasLogIn } = useAppState();
  const {
    dashboard: { importGitHubRepository },
  } = useActions();

  const { isFree } = useWorkspaceSubscription();
  const { hasMaxPublicRepositories } = useWorkspaceLimits();

  const [isImporting, setIsImporting] = React.useState(false);
  const [shouldFetch, setShouldFetch] = React.useState(false);
  const [
    privateRepoFreeAccountError,
    setPrivateRepoFreeAccountError,
  ] = React.useState<string | undefined>(undefined);
  const [url, setUrl] = React.useState<UrlState>({
    raw: '',
    parsed: null,
    error: null,
  });

  const githubRepo = useGithubRepo({
    owner: url.parsed?.owner,
    name: url.parsed?.name,
    shouldFetch,
    onCompleted: async repo => {
      setShouldFetch(false);

      if (repo.private && isFree) {
        setPrivateRepoFreeAccountError(url.raw);
        return;
      }

      if (repo.authorization === GithubRepoAuthorization.Write) {
        setIsImporting(true);
        await importGitHubRepository({
          owner: repo.owner.login,
          name: repo.name,
        });
        setIsImporting(false);
      } else {
        onRepoSelect(repo);
      }
    },
  });

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value) {
      setUrl({ raw: value, parsed: null, error: null });
      return;
    }

    const parsedInput = getOwnerAndRepoFromInput(value);
    if (!parsedInput) {
      setUrl({
        raw: value,
        parsed: null,
        error: 'The URL provided is not valid.',
      });
    } else {
      setUrl({
        raw: value,
        parsed: {
          // getOwnerAndRepoFromInput might return null
          // but that won't be the case since there's an
          // earlier check to see if the input is valid.
          // using optional chaining to appease typescript.
          owner: parsedInput?.owner,
          name: parsedInput?.repo,
        },
        error: null,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasMaxPublicRepositories) {
      return;
    }

    track('Create New - Import Repo', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
    setShouldFetch(true);
  };

  if (!hasLogIn) {
    return <UnauthenticatedImport />;
  }

  const isLoading = githubRepo.state === 'loading' || isImporting;
  const limitImportBasedOnSubscription =
    privateRepoFreeAccountError === url.raw;

  return (
    <Stack direction="vertical" gap={4}>
      <Text
        as="h2"
        id="form-title"
        css={{
          fontSize: '16px',
          fontWeight: 500,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Enter the GitHub repository URL to import
      </Text>
      {hasMaxPublicRepositories ? <MaxPublicRepos /> : null}
      <Element
        {...(hasMaxPublicRepositories
          ? {
              as: 'div',
              css: {
                opacity: hasMaxPublicRepositories ? 0.4 : 1,
                pointerEvents: hasMaxPublicRepositories ? 'none' : 'initial',
              },
            }
          : { as: 'form', onSubmit: handleFormSubmit })}
      >
        <Stack gap={2}>
          <Input
            aria-disabled={hasMaxPublicRepositories}
            aria-describedby="form-title form-error"
            aria-invalid={Boolean(url.error)}
            css={{ height: '32px' }}
            placeholder="GitHub Repository URL"
            tabIndex={hasMaxPublicRepositories ? -1 : 0}
            type="text"
            value={url.raw}
            onChange={handleUrlInputChange}
            required
          />
          <Button
            css={{ height: '32px', paddingRight: 24, paddingLeft: 24 }}
            aria-disabled={hasMaxPublicRepositories}
            disabled={Boolean(url.error) || isLoading}
            tabIndex={hasMaxPublicRepositories ? -1 : 0}
            type="submit"
            autoWidth
          >
            {isLoading ? 'Importing...' : 'Import'}
          </Button>
        </Stack>
        <Element aria-atomic="true" id="form-error" role="alert">
          {url.error ||
          githubRepo.state === 'error' ||
          limitImportBasedOnSubscription ? (
            <Text
              as="small"
              css={css({
                display: 'block',
                marginTop: 2,
                color: 'errorForeground',
                fontSize: 12,
              })}
            >
              {url.error}
              {githubRepo.state === 'error' && githubRepo.error}
              {limitImportBasedOnSubscription && <PrivateRepoFreeTeam />}
            </Text>
          ) : null}
        </Element>
      </Element>
    </Stack>
  );
};
