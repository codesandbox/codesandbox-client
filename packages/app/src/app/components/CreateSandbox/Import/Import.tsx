import track from '@codesandbox/common/lib/utils/analytics';
import {
  Button,
  Element,
  Input,
  Stack,
  Text,
  Icon,
  InteractiveOverlay,
} from '@codesandbox/components';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { GithubRepoAuthorization } from 'app/graphql/types';
import { useActions, useAppState } from 'app/overmind';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { RestrictedPublicReposImport } from 'app/pages/Dashboard/Components/shared/RestrictedPublicReposImport';
import { MaxPublicRepos } from './MaxPublicRepos';
import { PrivateRepoFreeTeam } from './PrivateRepoFreeTeam';
import { RestrictedPrivateReposImport } from './RestrictedPrivateRepositoriesImport';
import { GithubRepoToImport } from './types';
import { useGithubRepo } from './useGithubRepo';
import { fuzzyMatchGithubToCsb, getOwnerAndRepoFromInput } from './utils';
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
        // is this still possible?
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
  const { activeTeamInfo } = useAppState();
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const githubAccounts = useGithubAccounts();

  const selectOptions = useMemo(
    () =>
      githubAccounts.data
        ? [githubAccounts.data.personal, ...githubAccounts.data.organizations]
        : undefined,
    [githubAccounts.data]
  );

  useEffect(() => {
    // Set initially selected account bazed on fuzzy matching
    if (githubAccounts.state === 'ready' && selectedAccount === undefined) {
      const match = fuzzyMatchGithubToCsb(activeTeamInfo?.name, selectOptions);

      setSelectedAccount(match.login);
    }
  }, [githubAccounts.state, selectedAccount, activeTeamInfo, selectOptions]);

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

  return githubAccounts.state === 'ready' && selectedAccount ? (
    <Stack direction="vertical" gap={3} css={{ fontFamily: 'Inter' }}>
      <Stack justify="space-between">
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
          {selectOptions.map(account => (
            <option key={account.id} value={account.login}>
              {account.login}
            </option>
          ))}
        </StyledSelect>
      </Stack>
      {githubRepos.state === 'ready' ? (
        <Stack
          as="ul"
          direction="vertical"
          gap={1}
          css={{ margin: 0, padding: 0, listStyle: 'none' }}
        >
          {githubRepos.data?.map(repo => {
            const importUrl = v2DefaultBranchUrl({
              owner: repo.owner.login,
              repoName: repo.name,
              workspaceId: activeTeamInfo.id,
              importFlag: true,
            });

            return (
              <InteractiveOverlay key={repo.id}>
                <StyledItem>
                  <Stack gap={4} align="center">
                    <Icon name="repository" color="#999999" />
                    <InteractiveOverlay.Anchor href={importUrl}>
                      <VisuallyHidden>Import</VisuallyHidden>
                      <Text size={13}>{repo.name}</Text>
                    </InteractiveOverlay.Anchor>
                    {repo.private ? (
                      <>
                        <VisuallyHidden>Private repository</VisuallyHidden>
                        <Icon name="lock" color="#999999" />
                      </>
                    ) : null}
                    {repo.updatedAt ? (
                      <Text size={13} variant="muted">
                        <VisuallyHidden>Last updated</VisuallyHidden>
                        {formatDistanceStrict(
                          zonedTimeToUtc(repo.updatedAt, 'Etc/UTC'),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </Text>
                    ) : null}
                  </Stack>
                  <StyledIndicator aria-hidden>Import</StyledIndicator>
                </StyledItem>
              </InteractiveOverlay>
            );
          })}
        </Stack>
      ) : null}
    </Stack>
  ) : null;
};

const StyledItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 14px;
  background-color: #1d1d1d;
  border-radius: 4px;

  &:hover,
  &:focus-within {
    background-color: #252525;
  }
`;

const StyledIndicator = styled.span`
  box-sizing: border-box;
  min-width: 80px;
  opacity: 0;
  padding: 8px;
  background-color: #343434;
  font-size: 12px;
  text-align: center;

  ${StyledItem}:hover &, ${StyledItem}:focus-within & {
    opacity: 1;
  }
`;
