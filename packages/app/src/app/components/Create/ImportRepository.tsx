import {
  Text,
  Stack,
  Loading,
  IconButton,
  ThemeProvider,
} from '@codesandbox/components';
import React, { useEffect, useState } from 'react';
import { useTabState } from 'reakit/Tab';

import track from '@codesandbox/common/lib/utils/analytics';

import { ModalContentProps } from 'app/pages/common/Modals';
import { SignIn } from 'app/pages/SignIn/SignIn';
import { useAppState } from 'app/overmind';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
import { GithubRepoAuthorization } from 'app/graphql/types';
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
import { useGithubRepo } from './hooks/useGithubRepo';

type View = 'signin' | 'permissions' | 'select' | 'fetching' | 'config';

export const ImportRepository: React.FC<
  ModalContentProps & { preSelectedRepo?: { owner: string; name: string } }
> = ({ preSelectedRepo }) => {
  const { hasLogIn } = useAppState();
  const {
    restrictsPublicRepos,
    restrictsPrivateRepos,
  } = useGitHubPermissions();

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: 'search-in-org',
  });

  const prefetchedGithubRepo = useGithubRepo({
    owner: preSelectedRepo?.owner,
    name: preSelectedRepo?.name,
    shouldFetch: !!preSelectedRepo,
  });

  const [selectedRepo, setSelectedRepo] = useState<GithubRepoToImport>(
    prefetchedGithubRepo.state === 'ready'
      ? prefetchedGithubRepo.data
      : undefined
  );

  const [viewState, setViewState] = useState<View>(() => {
    if (!hasLogIn) {
      return 'signin';
    }

    if (restrictsPublicRepos) {
      return 'permissions';
    }

    if (preSelectedRepo) {
      if (!selectedRepo) {
        // If the repo was not yet fetched, there should be a brief loading state before the final step
        return 'fetching';
      }
      return 'config';
    }

    return 'select';
  });

  const forkMode =
    viewState === 'config' &&
    selectedRepo.authorization === GithubRepoAuthorization.Read;

  useEffect(() => {
    if (prefetchedGithubRepo.state === 'ready') {
      setSelectedRepo(prefetchedGithubRepo.data);
      setViewState('config');
      return;
    }

    if (prefetchedGithubRepo.state === 'error') {
      setSelectedRepo(undefined);
      setViewState('select');
    }
  }, [prefetchedGithubRepo]);

  const selectGithubRepo = (repo: GithubRepoToImport) => {
    setSelectedRepo(repo);
    setViewState('config');
  };

  const trackTabClick = (tab: string) => {
    track(`Import repository - Select - Click Tab`, {
      tab_name: tab,
    });
  };

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
                    <Tab
                      {...tabState}
                      onClick={() => trackTabClick('search-in-org')}
                      stopId="search-in-org"
                    >
                      Search in organizations
                    </Tab>

                    <Tab
                      {...tabState}
                      onClick={() => trackTabClick('find-by-url')}
                      stopId="find-by-url"
                    >
                      Find by URL
                    </Tab>

                    <Tab
                      {...tabState}
                      onClick={() => trackTabClick('from-template')}
                      stopId="from-template"
                    >
                      Start from a template
                    </Tab>
                  </Tabs>
                  {restrictsPrivateRepos && <RestrictedPrivateReposInfo />}
                </Stack>
              </ModalSidebar>
              <ModalContent>
                <Panel tab={tabState} id="search-in-org">
                  <SearchInOrganizations
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
              </ModalContent>
            </>
          )}
          {viewState === 'fetching' && (
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
                <ConfigureRepo repository={selectedRepo} forkMode={forkMode} />
              </ModalContent>
            </>
          )}
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
