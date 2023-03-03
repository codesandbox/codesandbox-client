import React from 'react';

import track from '@codesandbox/common/lib/utils/analytics';
import {
  Button,
  Element,
  Input,
  SkeletonText,
  Stack,
  Text,
} from '@codesandbox/components';

import {
  GithubRepoAuthorization,
  RepositoryTeamsQuery,
  RepositoryTeamsQueryVariables,
} from 'app/graphql/types';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { RestrictedPublicReposImport } from 'app/pages/Dashboard/Components/shared/RestrictedPublicReposImport';

import { useLazyQuery } from '@apollo/react-hooks';
import { debounce } from 'lodash';
import { pluralize } from 'app/utils/pluralize';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { MaxPublicRepos } from './MaxPublicRepos';
import { PrivateRepoFreeTeam } from './PrivateRepoFreeTeam';
import { RestrictedPrivateReposImport } from './RestrictedPrivateRepositoriesImport';
import { GithubRepoToImport } from './types';
import { useGithubRepo } from './useGithubRepo';
import { getOwnerAndNameFromInput } from './utils';
import { SuggestedRepositories } from './SuggestedRepositories';
import { GET_REPOSITORY_TEAMS } from '../queries';

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
  const { activeTeam, hasLogIn } = useAppState();
  const { restrictsPublicRepos, restrictsPrivateRepos } = useGitHuPermissions();
  const {
    dashboard: { importGitHubRepository },
  } = useActions();

  const { isFree } = useWorkspaceSubscription();
  const { hasMaxPublicRepositories } = useWorkspaceLimits();

  // Use a variable instead of `loading` from `useLazyQuery` because
  // we want the UI to look like it's loading before the debounced fn
  // actually performs the query.
  const [isQueryingTeams, setIsQueryingTeams] = React.useState(false);
  const [
    getRepositoryTeams,
    { data: repositoryTeamsData, variables },
  ] = useLazyQuery<RepositoryTeamsQuery, RepositoryTeamsQueryVariables>(
    GET_REPOSITORY_TEAMS,
    {
      onCompleted: () => setIsQueryingTeams(false),
    }
  );

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

  const existingRepositoryTeams = React.useMemo(() => {
    if (
      repositoryTeamsData &&
      variables.owner === url.parsed?.owner &&
      variables.name === url.parsed?.name
    ) {
      return repositoryTeamsData.projects.reduce((acc, cur) => {
        if (cur.team && cur.team?.id !== activeTeam) {
          acc.push(cur.team);
        }

        return acc;
      }, []);
    }

    return null;
  }, [url.parsed, repositoryTeamsData]);

  const debouncedGetRepositoryTeams = React.useCallback(
    debounce(getRepositoryTeams, 1000),
    []
  );

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

    const parsedInput = getOwnerAndNameFromInput(value);
    if (!parsedInput) {
      setUrl({
        raw: value,
        parsed: null,
        error: 'The URL provided is not valid.',
      });
    } else {
      setUrl({
        raw: value,
        parsed: parsedInput,
        error: null,
      });

      setIsQueryingTeams(true);
      debouncedGetRepositoryTeams({ variables: parsedInput });
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
              aria-describedby="form-title form-error repo-teams"
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
              disabled={
                Boolean(url.error) ||
                isLoading ||
                disableImport ||
                isQueryingTeams
              }
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
              <Text size={12} variant="danger">
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
        {isQueryingTeams && <SkeletonText />}
        {existingRepositoryTeams && existingRepositoryTeams.length >= 1 ? (
          <Text color="#F9D685" id="repo-teams">
            This repository has been imported into{' '}
            {pluralize({ word: 'team', count: existingRepositoryTeams.length })}
            :{' '}
            {existingRepositoryTeams.map((team, teamIndex) => (
              <>
                <Button
                  key={team.id}
                  as="a"
                  css={{
                    display: 'inline-flex',
                    color: 'inherit',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                  href={v2DefaultBranchUrl({
                    owner: variables.owner,
                    repoName: variables.name,
                    workspaceId: team.id,
                  })}
                  variant="link"
                >
                  {team.name}
                </Button>
                {teamIndex === existingRepositoryTeams.length - 1 ? '.' : ', '}
              </>
            ))}
          </Text>
        ) : null}
      </Stack>
      {restrictsPublicRepos ? null : <SuggestedRepositories />}
    </Stack>
  );
};
