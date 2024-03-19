import { useEffect, useState } from 'react';

import { useEffects } from 'app/overmind';
import { GithubRepoToImport } from '../utils/types';

export type GithubReposResult =
  | { state: 'loading' }
  | { state: 'error'; error: string }
  | { state: 'partial'; repositories: GithubRepoToImport[] }
  | { state: 'ready'; repositories: GithubRepoToImport[] };

export const useGithubRepos = (
  orgName: string,
  orgType: 'personal' | 'organization' | undefined
): GithubReposResult => {
  const [repoCache, setRepoCache] = useState<Record<string, GithubReposResult>>(
    {}
  );
  const effects = useEffects();

  useEffect(() => {
    if (!orgName || repoCache[orgName]) {
      return;
    }

    setRepoCache(cache => ({ ...cache, [orgName]: { state: 'loading' } }));

    if (orgType === 'personal') {
      fetchPartialAccountRepos();
    }

    if (orgType === 'organization') {
      fetchPartialOrganizationRepos();
    }
  }, [orgName, orgType]);

  const updateState = (
    newState: 'partial' | 'ready',
    repos: Omit<GithubRepoToImport, 'appInstalled'>[]
  ) => {
    setRepoCache(cache => ({
      ...cache,
      [orgName]: {
        state: newState,
        repositories: repos.map(r => ({
          ...r,
          appInstalled: undefined,
        })),
      },
    }));
  };

  const fetchPartialAccountRepos = () => {
    effects.gql.queries.getPartialAccountRepos({}).then(data => {
      updateState('partial', data.me.githubRepos);
      fetchFullAccountRepos();
    });
  };

  const fetchFullAccountRepos = () => {
    effects.gql.queries.getFullAccountRepos({}).then(data => {
      updateState('ready', data.me.githubRepos);
    });
  };

  const fetchPartialOrganizationRepos = () => {
    effects.gql.queries
      .getPartialOrganizationRepos({
        organization: orgName,
      })
      .then(data => {
        updateState('partial', data.githubOrganizationRepos);
        fetchFullOrganizationRepos();
      });
  };

  const fetchFullOrganizationRepos = () => {
    effects.gql.queries
      .getFullOrganizationRepos({
        organization: orgName,
      })
      .then(data => {
        updateState('ready', data.githubOrganizationRepos);
      });
  };

  return repoCache[orgName] || { state: 'loading' };
};
