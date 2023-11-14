import {
  Text,
  Stack,
  IconButton,
  ThemeProvider,
} from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import React, { useState } from 'react';
import { useTabState } from 'reakit/Tab';

import track from '@codesandbox/common/lib/utils/analytics';

import { ModalContentProps } from 'app/pages/common/Modals';
import {
  Container,
  Tab,
  Panel,
  Tabs,
  HeaderInformation,
  ModalContent,
  ModalSidebar,
  ModalBody,
} from './elements';
import { Import } from './ImportRepository/Import';
import { GithubRepoToImport } from './ImportRepository/types';
import { ImportInfo } from './ImportRepository/ImportInfo';
import { FromRepo } from './ImportRepository/FromRepo';
import { ImportSandbox } from './ImportSandbox';

export const COLUMN_MEDIA_THRESHOLD = 1600;

export const ImportRepository: React.FC<ModalContentProps> = ({
  isModal,
  closeModal,
}) => {
  const { environment } = useAppState();

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: 'import',
  });

  const [viewState, setViewState] = useState<'initial' | 'fork'>('initial');

  const [selectedRepo, setSelectedRepo] = useState<GithubRepoToImport>();

  const selectGithubRepo = (repo: GithubRepoToImport) => {
    setSelectedRepo(repo);
    setViewState('fork');
  };

  const showImportRepository = !environment.isOnPrem;

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
            {viewState === 'initial' ? (
              <Text size={4} variant="muted">
                New
              </Text>
            ) : (
              // TODO: add aria-label based on title to IconButton?
              <IconButton
                name="arrowDown"
                variant="square"
                size={16}
                title="Back to overview"
                css={{
                  transform: 'rotate(90deg)',
                  '&:active:not(:disabled)': {
                    transform: 'rotate(90deg)',
                  },
                }}
                onClick={() => {
                  setViewState('initial');
                }}
              />
            )}
          </HeaderInformation>

          {/* isModal is undefined on /s/ page */}
          {isModal ? (
            // TODO: IconButton doesn't have aria label or visuallyhidden text (reads floating label too late)
            <IconButton
              name="cross"
              variant="square"
              size={16}
              title="Close modal"
              onClick={() => closeModal()}
            />
          ) : null}
        </Stack>

        <ModalBody>
          <ModalSidebar>
            {viewState === 'initial' ? (
              <Stack direction="vertical">
                <Tabs {...tabState} aria-label="Create new">
                  {showImportRepository && (
                    <Tab
                      {...tabState}
                      onClick={() => {
                        track('Create New - Click Tab', {
                          codesandbox: 'V1',
                          event_source: 'UI',
                          tab_name: 'Import from Github',
                        });
                      }}
                      stopId="import"
                    >
                      Import repository
                    </Tab>
                  )}

                  <Tab
                    {...tabState}
                    onClick={() => {
                      track('Create New - Click Tab', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                        tab_name: 'Import template',
                      });
                    }}
                    stopId="import-template"
                  >
                    Import template
                  </Tab>
                </Tabs>
              </Stack>
            ) : null}

            {viewState === 'fork' ? (
              <ImportInfo githubRepo={selectedRepo} />
            ) : null}
          </ModalSidebar>

          <ModalContent>
            {viewState === 'initial' && (
              <Stack direction="vertical" gap={2}>
                <Panel tab={tabState} id="import">
                  <Import onRepoSelect={selectGithubRepo} />
                </Panel>

                <Panel tab={tabState} id="import-template">
                  <ImportSandbox />
                </Panel>
              </Stack>
            )}

            {viewState === 'fork' ? (
              <FromRepo
                repository={selectedRepo}
                onCancel={() => {
                  setViewState('initial');
                }}
              />
            ) : null}
          </ModalContent>
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
