import track from '@codesandbox/common/lib/utils/analytics';
import {
  Button,
  Element,
  Input,
  Stack,
  Text,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { GithubRepoAuthorization } from 'app/graphql/types';
import { useActions, useAppState } from 'app/overmind';
import React, { useState } from 'react';

import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { RestrictedPublicReposImport } from 'app/pages/Dashboard/Components/shared/RestrictedPublicReposImport';
import { MaxPublicRepos } from './MaxPublicRepos';
import { PrivateRepoFreeTeam } from './PrivateRepoFreeTeam';
import { RestrictedPrivateReposImport } from './RestrictedPrivateRepositoriesImport';
import { GithubRepoToImport } from './types';
import { useGithubRepo } from './useGithubRepo';
import { getOwnerAndRepoFromInput } from './utils';
import { useGithubAccounts } from './useGithubOrganizations';
import { useGitHubAccountRepositories } from './useGitHubAccountRepositories';
import { StyledSelect } from '../elements';

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
  const { restrictsPublicRepos, restrictsPrivateRepos } = useGitHuPermissions();
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

  const isLoading = githubRepo.state === 'loading' || isImporting;
  const limitImportBasedOnSubscription =
    privateRepoFreeAccountError === url.raw;
  const disableImport = hasMaxPublicRepositories || restrictsPublicRepos;

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

    if (disableImport) {
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

  return (
    <Stack direction="vertical" gap={8}>
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
        {restrictsPublicRepos ? <RestrictedPublicReposImport /> : null}
        <Element as="form" onSubmit={handleFormSubmit}>
          <Stack gap={2}>
            <Input
              aria-disabled={hasMaxPublicRepositories}
              aria-describedby="form-title form-error"
              aria-invalid={Boolean(url.error)}
              css={{ height: '32px' }}
              disabled={disableImport}
              placeholder="GitHub Repository URL"
              type="text"
              value={url.raw}
              onChange={handleUrlInputChange}
              required
            />
            <Button
              css={{ height: '32px', paddingRight: 24, paddingLeft: 24 }}
              disabled={Boolean(url.error) || isLoading || disableImport}
              type="submit"
              autoWidth
            >
              {isLoading ? 'Importing...' : 'Import'}
            </Button>
          </Stack>
          <Element
            aria-atomic="true"
            aria-live="polite"
            css={{
              marginTop: '8px',
            }}
            id="form-error"
          >
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
                {/**
                 * If there's a 404 error coming from GitHub and the user has not given
                 * access to private repos, inform that reviewing their GH permissions
                 * might be necessary
                 * */}
                {githubRepo.state === 'error' &&
                restrictsPrivateRepos &&
                githubRepo.code === 'NOT_FOUND' ? (
                  <RestrictedPrivateReposImport />
                ) : null}
                {/**
                 * Any other GitHub errors will be displayed as is.
                 * */}
                {githubRepo.state === 'error' && !restrictsPrivateRepos
                  ? githubRepo.error
                  : null}
                {limitImportBasedOnSubscription && <PrivateRepoFreeTeam />}
              </Text>
            ) : null}
          </Element>
        </Element>
      </Stack>
      <SuggestedRepos />
    </Stack>
  );
};

const SuggestedRepos = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const githubAccounts = useGithubAccounts();

  const selectOptions = githubAccounts.data
    ? [githubAccounts.data.personal, ...githubAccounts.data.organizations]
    : undefined;

  // eslint-disable-next-line no-nested-ternary
  const selectedAccountType = selectedAccount
    ? selectedAccount === githubAccounts?.data?.personal?.login
      ? 'personal'
      : 'organization'
    : undefined;

  const githubRepos = useGitHubAccountRepositories({
    name: selectedAccount,
    accountType: selectedAccountType,
  });

  return githubAccounts.state === 'ready' ? (
    <Stack direction="vertical" gap={3}>
      <div>
        <StyledSelect
          css={{
            color: '#e5e5e5',
          }}
          icon={() => <Icon css={{ marginLeft: 8 }} name="github" />}
          onChange={e => {
            setSelectedAccount(e.target.value);
          }}
          value={selectedAccount}
        >
          {selectOptions.map(org => (
            <option key={org.id} value={org.login}>
              {org.login}
            </option>
          ))}
        </StyledSelect>
      </div>
      {githubRepos.state === 'ready' ? (
        <Stack direction="vertical" gap={3}>
          {githubRepos.data?.map(repo => (
            <div key={repo.id}>
              {repo.id}, {repo.name}
            </div>
          ))}
        </Stack>
      ) : null}
    </Stack>
  ) : null;
};
