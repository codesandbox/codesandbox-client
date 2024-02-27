import {
  Text,
  Stack,
  IconButton,
  ThemeProvider,
} from '@codesandbox/components';
import React, { useState } from 'react';
import { useTabState } from 'reakit/Tab';

import { ModalContentProps } from 'app/pages/common/Modals';
import { SignIn } from 'app/pages/SignIn/SignIn';
import { useAppState } from 'app/overmind';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
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
import { SelectRepo } from './ImportRepository/steps/SelectRepo';
import { ConfigureRepoForm } from './ImportRepository/steps/ConfigureRepoForm';

type View = 'signin' | 'permissions' | 'select' | 'config';

export const ImportRepository: React.FC<ModalContentProps> = () => {
  const { hasLogIn } = useAppState();
  const {
    restrictsPublicRepos,
    restrictsPrivateRepos,
  } = useGitHubPermissions();

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: 'import',
  });

  const [viewState, setViewState] = useState<View>(() => {
    if (!hasLogIn) {
      return 'signin';
    }

    if (restrictsPublicRepos) {
      return 'permissions';
    }

    return 'select';
  });

  const [selectedRepo, setSelectedRepo] = useState<GithubRepoToImport>();

  const selectGithubRepo = (repo: GithubRepoToImport) => {
    setSelectedRepo(repo);
    setViewState('config');
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
            {viewState === 'permissions' && (
              <Text size={4}>Connect to GitHub</Text>
            )}
            {viewState === 'select' && <Text size={4}>New repository</Text>}
            {viewState === 'config' && (
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
          {viewState === 'permissions' && (
            <ModalContent>
              <AuthorizeGitHubPermissions />
            </ModalContent>
          )}
          {viewState === 'select' && (
            <>
              <ModalSidebar>
                <Stack
                  direction="vertical"
                  justify="space-between"
                  css={{ height: '100%', paddingBottom: '24px' }}
                >
                  <Tabs {...tabState} aria-label="Create new">
                    <Tab
                      {...tabState}
                      // onClick={() => trackTabClick('import')}
                      stopId="import"
                    >
                      Import from GitHub
                    </Tab>

                    <Tab
                      {...tabState}
                      // onClick={() => trackTabClick('official')}
                      stopId="fork"
                    >
                      Explore GitHub
                    </Tab>

                    <Tab
                      {...tabState}
                      // onClick={() => trackTabClick('official')}
                      stopId="template"
                    >
                      Start from a template
                    </Tab>
                  </Tabs>
                  {restrictsPrivateRepos && <RestrictedPrivateReposInfo />}
                </Stack>
              </ModalSidebar>
              <ModalContent>
                <Panel tab={tabState} id="import">
                  <SelectRepo onSelected={selectGithubRepo} />
                </Panel>
              </ModalContent>
            </>
          )}
          {viewState === 'config' && (
            <>
              <ModalSidebar>
                <RepoInfo githubRepo={selectedRepo} />
              </ModalSidebar>

              <ModalContent>
                <ConfigureRepoForm
                  repository={selectedRepo}
                  onCancel={() => {
                    setViewState('select');
                  }}
                />
              </ModalContent>
            </>
          )}
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
