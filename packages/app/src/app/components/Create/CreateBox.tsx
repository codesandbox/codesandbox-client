import styled, { keyframes } from 'styled-components';
import {
  Text,
  Stack,
  Loading,
  IconButton,
  ThemeProvider,
} from '@codesandbox/components';
import { useActions, useAppState, useEffects } from 'app/overmind';
import React, { useState, useEffect } from 'react';

import track from '@codesandbox/common/lib/utils/analytics';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import { ModalContentProps } from 'app/pages/common/Modals';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';

import {
  Container,
  HeaderInformation,
  ModalContent,
  ModalSidebar,
  ModalBody,
} from './elements';
import { TemplateList } from './TemplateList';
import { useTeamTemplates } from './hooks/useTeamTemplates';
import { CreateParams, SandboxToFork } from './utils/types';
import { SearchBox } from './SearchBox';
import { CreateBoxForm } from './CreateBox/CreateBoxForm';
import { TemplateInfo } from './CreateBox/TemplateInfo';
import {
  mapSandboxGQLResponseToSandboxToFork,
  parsePrivacy,
} from './utils/api';
import { WorkspaceSelect } from '../WorkspaceSelect';
import { FEATURED_IDS } from './utils/constants';
import { TemplateFilter } from './TemplateFilter';

type CreateBoxProps = ModalContentProps & {
  collectionId?: string;
  sandboxIdToFork?: string;
  isStandalone?: boolean;
};

type ViewState = 'select' | 'loading' | 'config';

export const CreateBox: React.FC<CreateBoxProps> = ({
  collectionId: initialCollectionId,
  sandboxIdToFork,
  closeModal,
  isStandalone,
}) => {
  const { hasLogIn, activeTeam, officialTemplates } = useAppState();
  const effects = useEffects();

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const [viewState, setViewState] = useState<ViewState>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<SandboxToFork>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<string[]>([]);

  const { teamTemplates, recentTemplates } = useTeamTemplates({
    teamId: activeTeam,
    hasLogIn,
  });

  const recentlyUsedTemplates = recentTemplates.slice(0, 4);
  const hasRecentlyUsedTemplates = recentlyUsedTemplates.length > 0;

  const featuredTemplates = FEATURED_IDS.map(id =>
    officialTemplates.find(t => t.id === id)
  )
    .filter(Boolean)
    .slice(0, hasRecentlyUsedTemplates ? 8 : 12);

  let filteredTemplates = officialTemplates.concat(teamTemplates);

  if (searchQuery) {
    filteredTemplates = filteredTemplates.filter(template => {
      return (
        template.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  }

  if (filters.length > 0) {
    filteredTemplates = filteredTemplates.filter(template => {
      return filters
        .map(item => item.toUpperCase())
        .every(
          item =>
            template.tags
              .map(tag => tag.toUpperCase().replace('-', ' '))
              .includes(item) || // by tag
            template.title?.toUpperCase().split(' ').includes(item) // by keyword in title
        );
    });
  }

  const gatherTags = filteredTemplates
    .map(t => t.tags)
    .flat()
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;

      return acc;
    }, {});
  const additionalTags = Object.keys(gatherTags).filter(
    key => gatherTags[key] > 1
  );

  useEffect(() => {
    if (!sandboxIdToFork) {
      return;
    }

    setViewState('loading');
    effects.gql.queries
      .getSandboxWithTemplate({ id: sandboxIdToFork })
      .then(result => {
        setSelectedTemplate(
          mapSandboxGQLResponseToSandboxToFork(result.sandbox)
        );
        setViewState('config');
      })
      .catch(e => {
        setViewState('select');
      });
  }, [sandboxIdToFork]);

  const selectTemplate = (sandbox: SandboxToFork) => {
    if (!hasLogIn) {
      // Open template in editor for anonymous users
      window.location.href = sandbox.editorUrl || sandboxUrl(sandbox);
      return;
    }

    setSelectedTemplate(sandbox);
    setViewState('config');

    track(`Create - Select template`, {
      type: 'fork',
      template_name: sandbox.title || sandbox.alias || sandbox.id,
    });
  };

  const openTemplate = (sandbox: SandboxToFork) => {
    const url = sandbox.editorUrl || sandboxUrl(sandbox);
    window.open(url, '_blank');

    track(`Create - Open template`, {
      type: 'open',
      template_name: sandbox.title || sandbox.alias || sandbox.id,
    });
  };

  if (viewState === 'config') {
    return (
      <CreateBoxConfig
        selectedTemplate={selectedTemplate}
        closeModal={closeModal}
        isStandalone={isStandalone}
        setViewState={setViewState}
        initialCollectionId={initialCollectionId}
      />
    );
  }

  if (viewState === 'loading') {
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
              <Text size={4}>Create</Text>
            </HeaderInformation>
          </Stack>

          <ModalBody>
            <Stack css={{ width: '100%' }} align="center" justify="center">
              <Loading size={12} />
            </Stack>
          </ModalBody>
        </Container>
      </ThemeProvider>
    );
  }

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
            <Text size={4}>Create</Text>
          </HeaderInformation>
        </Stack>

        <ModalBody>
          <ModalContent
            style={{
              overflow: 'visible',
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stack
              direction="horizontal"
              gap={2}
              justify="space-between"
              css={{ marginBottom: 16 }}
            >
              <ScrollView>
                <div className="sticky begin">
                  <div />
                </div>
                <TemplateFilter
                  onChange={setFilters}
                  additionalTags={additionalTags}
                />
                <div className="sticky end">
                  <div />
                </div>
              </ScrollView>

              <SearchBox
                value={searchQuery}
                onChange={e => {
                  const query = e.target.value;

                  setSearchQuery(query);
                }}
              />
            </Stack>
            <div style={{ overflow: 'auto' }}>
              <Stack direction="vertical" gap={2}>
                {filters.length === 0 && searchQuery === '' ? (
                  <>
                    {hasRecentlyUsedTemplates && (
                      <TemplateList
                        searchQuery={searchQuery}
                        title="Recently used"
                        key="Recently used"
                        templates={recentlyUsedTemplates}
                        onSelectTemplate={selectTemplate}
                        onOpenTemplate={openTemplate}
                      />
                    )}
                    <TemplateList
                      title="Popular"
                      key="Popular"
                      searchQuery={searchQuery}
                      templates={featuredTemplates}
                      onSelectTemplate={selectTemplate}
                      onOpenTemplate={openTemplate}
                    />
                  </>
                ) : (
                  <TemplateList
                    key={filters.join()}
                    searchQuery={searchQuery}
                    templates={filteredTemplates}
                    onSelectTemplate={selectTemplate}
                    onOpenTemplate={openTemplate}
                  />
                )}
              </Stack>
            </div>
          </ModalContent>
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};

const ScrollView = styled.div`
  flex: 1;
  overflow: auto;
  padding-bottom: 8px;
  white-space: nowrap;
  position: relative;
  display: flex;

  .sticky {
    position: sticky;
    z-index: 9;
    width: 0;
    pointer-events: none;

    --scroll-buffer: 2rem;
    opacity: 0;
    animation: ${keyframes`
    to {
      opacity: 1;
    }
    `} both linear;
    animation-timeline: scroll(x);

    > div {
      position: absolute;
      top: 0;
      min-width: 20px;
      height: 100%;
    }
  }

  .begin {
    animation-range: 0 var(--scroll-buffer);
    left: 0;

    > div {
      left: 0;
      background: linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, #151515 100%);
    }
  }

  .end {
    animation-range: calc(100% - var(--scroll-buffer)) 100%;
    animation-direction: reverse;
    right: -1px;

    > div {
      right: 0;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #151515 100%);
    }
  }
`;

const CreateBoxConfig: React.FC<{
  selectedTemplate: SandboxToFork;
  setViewState: (viewState: ViewState) => void;
  closeModal: () => void;
  initialCollectionId?: string;
  isStandalone?: boolean;
}> = ({
  selectedTemplate,
  initialCollectionId,
  isStandalone,
  setViewState,
  closeModal,
}) => {
  const { hasLogIn, activeTeam } = useAppState();
  const actions = useActions();
  const [loading, setLoading] = useState(false);

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;
  const parsedUrl = new URL(window.location.href);
  const initialPrivacy = parsePrivacy(parsedUrl.searchParams.get('privacy'));

  const [collectionId, setCollectionId] = useState<string | undefined>(
    initialCollectionId
  );
  const [autoLaunchVSCode] = useGlobalPersistedState(
    'AUTO_LAUNCH_VSCODE',
    false
  );

  const createFromTemplate = (
    sandbox: SandboxToFork,
    {
      name,
      createAs,
      permission,
      editor,
      customVMTier,
      sandboxId,
    }: CreateParams
  ) => {
    const openInVSCode = editor === 'vscode';

    track(`Create - Submit form`, {
      type: 'fork',
      title: name,
      template_name: sandbox.title || sandbox.alias || sandbox.id,
      open_in_editor: editor,
      ...(customVMTier ? { vm_tier: customVMTier } : {}),
    });

    setLoading(true);

    actions.dashboard
      .forkSandbox({
        sandboxId,
        openInNewWindow: false,
        openInVSCode,
        autoLaunchVSCode,
        customVMTier,
        redirectAfterFork: !isStandalone,
        body: {
          title: name,
          collectionId,
          privacy: permission,
          v2: createAs === 'devbox',
        },
      })
      .then(forkedSandbox => {
        if (forkedSandbox && isStandalone) {
          window.parent.postMessage(
            {
              type: 'sandbox-created',
              data: {
                id: forkedSandbox.id,
                alias: forkedSandbox.alias,
                url: sandboxUrl(forkedSandbox),
              },
            },
            '*'
          );
        }
      })
      .finally(() => {
        if (closeModal) {
          closeModal();
        }
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
                setViewState('select');
              }}
            />
          </HeaderInformation>
        </Stack>

        <ModalBody>
          <ModalSidebar>
            <TemplateInfo template={selectedTemplate} />

            {hasLogIn && (
              <WorkspaceSelect
                selectedTeamId={activeTeam}
                onSelect={teamId => {
                  actions.setActiveTeam({ id: teamId });
                  setCollectionId(undefined);
                }}
              />
            )}
          </ModalSidebar>

          <ModalContent>
            <CreateBoxForm
              template={selectedTemplate}
              collectionId={collectionId}
              setCollectionId={setCollectionId}
              initialPrivacy={initialPrivacy}
              onCancel={() => {
                setViewState('select');
              }}
              onSubmit={params => {
                createFromTemplate(selectedTemplate, params);
              }}
              onClose={() => closeModal()}
              loading={loading}
            />
          </ModalContent>
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
