import React from 'react';
import VisuallyHidden from '@reach/visually-hidden';
import { debounce } from 'lodash';
import { useLazyQuery } from '@apollo/react-hooks';

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
  v2DefaultBranchUrl,
  docsUrl,
} from '@codesandbox/common/lib/utils/url-generator';

import {
  GithubRepoAuthorization,
  RepositoryTeamsQuery,
  RepositoryTeamsQueryVariables,
} from 'app/graphql/types';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
import { RestrictedPublicReposImport } from 'app/pages/Dashboard/Components/shared/RestrictedPublicReposImport';

import { InactiveTeam } from './InactiveTeam';
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
  const {
    restrictsPublicRepos,
    restrictsPrivateRepos,
  } = useGitHubPermissions();
  const {
    dashboard: { importGitHubRepository },
  } = useActions();

  const { isFree, isInactiveTeam } = useWorkspaceSubscription();
  const { hasMaxPublicRepositories } = useWorkspaceLimits();

  // Use a variable instead of `loading` from `useLazyQuery` because
  // we want the UI to look like it's loading before the debounced fn
  // actually performs the query.
  const [isQueryingImports, setIsQueryingImports] = React.useState(false);
  const [
    getRepositoryTeams,
    { data: repositoryTeamsData, variables },
  ] = useLazyQuery<RepositoryTeamsQuery, RepositoryTeamsQueryVariables>(
    GET_REPOSITORY_TEAMS,
    {
      fetchPolicy: 'cache-and-network',
      onCompleted: () => setIsQueryingImports(false),
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
  const hasExistingImports =
    existingRepositoryTeams && existingRepositoryTeams.length >= 1;

  const disableImport =
    hasMaxPublicRepositories || restrictsPublicRepos || isInactiveTeam;

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

      setIsQueryingImports(true);
      debouncedGetRepositoryTeams({ variables: parsedInput });
    }
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (typeof e !== 'undefined') {
      e.preventDefault();
    }

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
        <Stack direction="vertical" gap={2}>
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
            Import repository
          </Text>

          <Text
            as="h3"
            id="form-title"
            variant="muted"
            css={{
              fontSize: '14px',
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Directly work on your GitHub repository in CodeSandbox.
            <br />
            Learn more about Repositories{' '}
            <a
              href={docsUrl('/learn/repositories/overview')}
              target="_blank"
              rel="noreferrer noopener"
            >
              here
            </a>
            .
          </Text>
        </Stack>

        {isInactiveTeam ? <InactiveTeam /> : null}
        {hasMaxPublicRepositories ? <MaxPublicRepos /> : null}
        {restrictsPublicRepos ? <RestrictedPublicReposImport /> : null}
        <Element>
          <Stack as="form" onSubmit={handleFormSubmit} gap={2}>
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
                isQueryingImports
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
          {/**
           * We check for hasExistingImports because
           * to avoid glitches with cached values.
           */}
          {isQueryingImports && !hasExistingImports && !url.error ? (
            <>
              <VisuallyHidden>
                Checking if {url.raw} has been imported into any of your teams
              </VisuallyHidden>
              <SkeletonText />
            </>
          ) : null}
          {hasExistingImports ? (
            <Text color="#F9D685" id="repo-teams" size={12}>
              This repository has been imported into{' '}
              {existingRepositoryTeams.length === 1 ? 'one' : 'some'} of your
              teams, open it on:{' '}
              {existingRepositoryTeams.map((team, teamIndex) => (
                <>
                  <Button
                    key={team.id}
                    as="a"
                    css={{
                      display: 'inline-flex',
                      color: 'inherit',
                      fontWeight: 500,
                      transition: 'color 300ms',
                      '&:hover:not(:disabled)': {
                        color: '#ffffff',
                      },
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
                  {existingRepositoryTeams.length > 1 &&
                    teamIndex !== existingRepositoryTeams.length - 1 &&
                    ', '}
                </>
              ))}
              .
            </Text>
          ) : null}
        </Element>
      </Stack>
      {disableImport ? null : <SuggestedRepositories />}
    </Stack>
  );
};
