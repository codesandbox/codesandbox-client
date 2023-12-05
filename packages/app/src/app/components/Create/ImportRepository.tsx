import {
  Text,
  Stack,
  IconButton,
  ThemeProvider,
} from '@codesandbox/components';
import React, { useState } from 'react';

import { ModalContentProps } from 'app/pages/common/Modals';
import {
  Container,
  HeaderInformation,
  ModalContent,
  ModalSidebar,
  ModalBody,
} from './elements';
import { Import } from './ImportRepository/Import';
import { GithubRepoToImport } from './ImportRepository/types';
import { ImportInfo } from './ImportRepository/ImportInfo';
import { ForkRepoForm } from './ImportRepository/ForkRepoForm';

export const COLUMN_MEDIA_THRESHOLD = 1600;

export const ImportRepository: React.FC<ModalContentProps> = ({
  isModal,
  closeModal,
}) => {
  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const [viewState, setViewState] = useState<'initial' | 'fork'>('initial');

  const [selectedRepo, setSelectedRepo] = useState<GithubRepoToImport>();

  const selectGithubRepo = (repo: GithubRepoToImport) => {
    setSelectedRepo(repo);
    setViewState('fork');
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
            {viewState === 'initial' ? (
              <Text size={4} variant="muted">
                Import repository
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
          {viewState === 'initial' ? (
            <ModalContent>
              <Import onRepoSelect={selectGithubRepo} />
            </ModalContent>
          ) : null}
          {viewState === 'fork' ? (
            <>
              <ModalSidebar>
                <ImportInfo githubRepo={selectedRepo} />
              </ModalSidebar>

              <ModalContent>
                <ForkRepoForm
                  repository={selectedRepo}
                  onCancel={() => {
                    setViewState('initial');
                  }}
                />
              </ModalContent>
            </>
          ) : null}
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
