import {
  Text,
  Stack,
  Loading,
  IconButton,
  ThemeProvider,
} from '@codesandbox/components';
import React, { useEffect, useState } from 'react';
import { useTabState } from 'reakit/Tab';

import { ModalContentProps } from 'app/pages/common/Modals';
import { SignIn } from 'app/pages/SignIn/SignIn';
import { useAppState, useEffects } from 'app/overmind';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
import { GithubRepoAuthorization } from 'app/graphql/types';
import { useGithubAccounts } from 'app/hooks/useGithubOrganizations';
import {
  Tab,
  Tabs,
  Panel,
  Container,
  HeaderInformation,
  ModalContent,
  ModalSidebar,
  ModalBody,
} from './elements';

import { GithubRepoToImport } from './utils/types';
import { RepoInfo } from './ImportRepository/components/RepoInfo';
import { RestrictedPrivateReposInfo } from './ImportRepository/components/RestrictedPrivateReposInfo';
import { AuthorizeGitHubPermissions } from './ImportRepository/steps/AuthorizeGitHubPermissions';
import { SearchInOrganizations } from './ImportRepository/steps/SearchInOrganizations';
import { ConfigureRepo } from './ImportRepository/steps/ConfigureRepo';
import { FindByURL } from './ImportRepository/steps/FindByURL';
import { StartFromTemplate } from './ImportRepository/steps/StartFromTemplate';
import { ForkRepo } from './ImportRepository/steps/ForkRepo';
import { ImportTemplate } from './ImportTemplate';

type View = 'signin' | 'permissions' | 'select' | 'loading' | 'config';

export const ImportRepository: React.FC<
  ModalContentProps & { preSelectedRepo?: { owner: string; name: string } }
> = ({ preSelectedRepo }) => {
  const { hasLogIn } = useAppState();
  const effects = useEffects();
  const {
    restrictsPublicRepos,
    restrictsPrivateRepos,
  } = useGitHubPermissions();
  const githubAccounts = useGithubAccounts(restrictsPublicRepos !== false);

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: 'search-in-org',
  });

  const [selectedRepo, setSelectedRepo] = useState<GithubRepoToImport | null>(
    null
  );

  const [viewState, setViewState] = useState<View>(() => {
    if (!hasLogIn) {
      return 'signin';
    }

    // GH integration is not yet fetched (can only happen with preselected repos)
    if (preSelectedRepo && restrictsPublicRepos === undefined) {
      return 'loading';
    }

    if (restrictsPublicRepos) {
      return 'permissions';
    }

    if (preSelectedRepo) {
      if (!selectedRepo) {
        // If the repo was not yet fetched, there should be a brief loading state before the final step
        return 'loading';
      }
      return 'config';
    }

    return 'select';
  });

  useEffect(() => {
    if (!hasLogIn || restrictsPublicRepos === undefined) {
      return;
    }

    if (restrictsPublicRepos) {
      setViewState('permissions');
    } else {
      setViewState('select');
    }
  }, [restrictsPublicRepos]);

  useEffect(() => {
    if (preSelectedRepo && restrictsPublicRepos === false) {
      handleFetchFullGithubRepo(preSelectedRepo);
    }
  }, [preSelectedRepo, restrictsPublicRepos]);

  const handleFetchFullGithubRepo = async (
    repo: {
      owner: string;
      name: string;
    },
    options: { runInBackground: boolean } = { runInBackground: false }
  ) => {
    if (viewState === 'loading') {
      return;
    }

    try {
      if (!options.runInBackground) {
        // Don't switch back to loading state when the repo is already fetched
        setViewState('loading');
      }
      const data = await effects.gql.queries.getGithubRepository({
        owner: repo.owner,
        name: repo.name,
      });
      setSelectedRepo(data.githubRepo);
      setViewState('config');
    } catch {
      setSelectedRepo(null);
      setViewState('select');
    }
  };

  const selectGithubRepo = (repo: GithubRepoToImport) => {
    setSelectedRepo(repo);
    setViewState('config');
    handleFetchFullGithubRepo({ owner: repo.owner.login, name: repo.name });
  };

  const forkMode = selectedRepo?.authorization === GithubRepoAuthorization.Read;

  return (
    <ThemeProvider>
      <Container>
        <Stack
          gap={4}
          align="center"
          css={{
            width: '100%',
            padding: mobileScreenSize ? '16px' : '24px',
          }}
        >
          <HeaderInformation>
            {viewState === 'select' && <Text size={4}>New repository</Text>}

            {/** Checks for repoToImport to not show the back button if you didn't pass through selection */}
            {viewState === 'config' && !preSelectedRepo && (
              <IconButton
                name="arrowDown"
                variant="square"
                size={16}
                title="Back to selection"
                css={{
                  transform: 'rotate(90deg)',
                  '&:active:not(:disabled)': {
                    transform: 'rotate(90deg)',
                  },
                }}
                onClick={() => {
                  setViewState('select');
                }}
              />
            )}
          </HeaderInformation>
        </Stack>

        <ModalBody>
          {viewState === 'signin' && <SignIn />}
          {viewState === 'permissions' && <AuthorizeGitHubPermissions />}
          {viewState === 'select' && (
            <>
              <ModalSidebar>
                <Stack
                  direction="vertical"
                  justify="space-between"
                  css={{
                    height: '100%',
                    paddingBottom: mobileScreenSize ? 0 : '24px',
                  }}
                >
                  <Tabs {...tabState} aria-label="Create new">
                    <Tab {...tabState} stopId="search-in-org">
                      Search in organizations
                    </Tab>

                    <Tab {...tabState} stopId="find-by-url">
                      Find by URL
                    </Tab>

                    <Tab {...tabState} stopId="from-template">
                      Start from a template
                    </Tab>

                    <Tab {...tabState} stopId="import-template">
                      Import template
                    </Tab>
                  </Tabs>
                  {restrictsPrivateRepos && <RestrictedPrivateReposInfo />}
                </Stack>
              </ModalSidebar>
              <ModalContent>
                <Panel tab={tabState} id="search-in-org">
                  <SearchInOrganizations
                    githubAccounts={githubAccounts}
                    onSelected={selectGithubRepo}
                    onFindByURLClicked={() => tabState.select('find-by-url')}
                  />
                </Panel>
                <Panel tab={tabState} id="find-by-url">
                  <FindByURL onSelected={selectGithubRepo} />
                </Panel>
                <Panel tab={tabState} id="from-template">
                  <StartFromTemplate />
                </Panel>
                <Panel tab={tabState} id="import-template">
                  <ImportTemplate />
                </Panel>
              </ModalContent>
            </>
          )}
          {viewState === 'loading' && (
            <Stack css={{ width: '100%' }} align="center" justify="center">
              <Loading size={12} />
            </Stack>
          )}
          {viewState === 'config' && (
            <>
              <ModalSidebar>
                <RepoInfo repository={selectedRepo} forkMode={forkMode} />
              </ModalSidebar>

              <ModalContent>
                {forkMode ? (
                  <ForkRepo
                    githubAccounts={githubAccounts}
                    repository={selectedRepo}
                  />
                ) : (
                  <ConfigureRepo
                    repository={selectedRepo}
                    onRefetchGithubRepo={repo =>
                      handleFetchFullGithubRepo(repo, { runInBackground: true })
                    }
                  />
                )}
              </ModalContent>
            </>
          )}
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
