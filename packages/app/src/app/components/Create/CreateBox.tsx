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

import { useBetaSandboxEditor } from 'app/hooks/useBetaSandboxEditor';

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
import styled from 'styled-components';

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

  // TODO
  // const { isFrozen } = useWorkspaceLimits();
  // const showImportTemplates = hasLogIn && activeTeam;

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
  const recentlyUsedTemplatesIds = recentlyUsedTemplates.map(t => t.id);

  const featuredTemplates = FEATURED_IDS.map(id =>
    officialTemplates.find(
      t => t.id === id && !recentlyUsedTemplatesIds.includes(t.id)
    )
  )
    .filter(Boolean)
    .slice(0, hasRecentlyUsedTemplates ? 6 : 9);

  let filteredTemplates = officialTemplates.concat(teamTemplates);

  if (searchQuery) {
    filteredTemplates = filteredTemplates.filter(template => {
      return (
        template.title.toLowerCase().includes(searchQuery) ||
        template.tags.some(tag => tag.includes(searchQuery))
      );
    });
  }

  if (filters.length > 0) {
    filteredTemplates = filteredTemplates.filter(template => {
      return filters
        .map(item => item.toUpperCase())
        .every(
          item =>
            template.tags.map(tag => tag.toUpperCase()).includes(item) || // by tag
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

  useEffect(() => {
    if (searchQuery) {
      track(`Create - Search Templates`, {
        query: searchQuery,
      });
    }
  }, [searchQuery]);

  const [hasBetaEditorExperiment] = useBetaSandboxEditor();

  const selectTemplate = (sandbox: SandboxToFork) => {
    if (!hasLogIn) {
      // Open template in editor for anonymous users
      window.location.href =
        sandbox.editorUrl || sandboxUrl(sandbox, hasBetaEditorExperiment);
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
    const url =
      sandbox.editorUrl || sandboxUrl(sandbox, hasBetaEditorExperiment);
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
          {/* <ModalSidebar>
            <Stack
              css={{ height: '100%' }}
              direction="vertical"
              justify="space-between"
            >
              <Stack direction="vertical">
                <Tabs {...tabState} aria-label="Create new">
                  {showFeaturedTemplates && (
                    <Tab
                      {...tabState}
                      onClick={() => trackTabClick('featured')}
                      stopId="featured"
                    >
                      Featured templates
                    </Tab>
                  )}

                  <Tab
                    {...tabState}
                    onClick={() => trackTabClick('all')}
                    stopId="all"
                  >
                    All templates
                  </Tab>

                  <Element css={{ height: '16px' }} />

                  {showTeamTemplates ? (
                    <Tab
                      {...tabState}
                      onClick={() => trackTabClick('workspace')}
                      stopId="workspace"
                    >
                      Workspace templates
                    </Tab>
                  ) : null}

                  {showImportTemplates ? (
                    <Tab
                      {...tabState}
                      onClick={() => trackTabClick('import-template')}
                      stopId="import-template"
                    >
                      Import template
                    </Tab>
                  ) : null}

                  <Tab
                    {...tabState}
                    onClick={() => trackTabClick('official')}
                    stopId="official"
                  >
                    Official templates
                  </Tab>

                  <Element css={{ height: '16px' }} />

                  {showCollections
                    ? collections.map(collection => (
                        <Tab
                          key={collection.key}
                          {...tabState}
                          stopId={slugify(collection.title)}
                          onClick={() => trackTabClick(collection.title)}
                        >
                          {collection.title}
                        </Tab>
                      ))
                    : null}
                </Tabs>
              </Stack>
              {!mobileScreenSize && !isFrozen && (
                <Stack
                  direction="vertical"
                  css={{ paddingBottom: '16px' }}
                  gap={2}
                >
                  <Text size={3} weight="600">
                    There&apos;s even more
                  </Text>
                  <Text size={2} color="#A6A6A6" lineHeight="1.35">
                    <DevboxAlternative
                      onClick={() => {
                        track(`Create - Open Community Search`);
                      }}
                    />
                  </Text>
                </Stack>
              )}
            </Stack>
          </ModalSidebar> */}

          <ModalContent>
            <Stack
              direction="horizontal"
              gap={2}
              justify="space-between"
              css={{ marginBottom: 16 }}
            >
              <ScrollView>
                <TemplateFilter
                  showWorkspaceOption={
                    !!filteredTemplates.find(item =>
                      item.tags.includes('workspace')
                    )
                  }
                  onChange={setFilters}
                  additionalTags={additionalTags}
                />
              </ScrollView>

              <SearchBox
                value={searchQuery}
                onChange={e => {
                  const query = e.target.value;

                  setSearchQuery(query);
                }}
              />
            </Stack>

            <Stack direction="vertical" gap={2}>
              {filters.length === 0 ? (
                <>
                  {hasRecentlyUsedTemplates && (
                    <TemplateList
                      title="Recently used"
                      templates={recentlyUsedTemplates}
                      onSelectTemplate={selectTemplate}
                      onOpenTemplate={openTemplate}
                    />
                  )}
                  <TemplateList
                    title="Popular"
                    templates={featuredTemplates}
                    onSelectTemplate={selectTemplate}
                    onOpenTemplate={openTemplate}
                  />
                </>
              ) : (
                <TemplateList
                  templates={filteredTemplates}
                  onSelectTemplate={selectTemplate}
                  onOpenTemplate={openTemplate}
                />
              )}
            </Stack>
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

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;
  const parsedUrl = new URL(window.location.href);
  const initialPrivacy = parsePrivacy(parsedUrl.searchParams.get('privacy'));

  const [collectionId, setCollectionId] = useState<string | undefined>(
    initialCollectionId
  );
  const [hasBetaEditorExperiment] = useBetaSandboxEditor();
  const [autoLaunchVSCode] = useGlobalPersistedState(
    'AUTO_LAUNCH_VSCODE',
    false
  );

  const createFromTemplate = (
    sandbox: SandboxToFork,
    { name, createAs, permission, editor, customVMTier }: CreateParams
  ) => {
    const openInVSCode = editor === 'vscode';

    track(`Create - Submit form`, {
      type: 'fork',
      title: name,
      template_name: sandbox.title || sandbox.alias || sandbox.id,
      open_in_editor: editor,
      ...(customVMTier ? { vm_tier: customVMTier } : {}),
    });

    actions.editor
      .forkExternalSandbox({
        sandboxId: sandbox.id,
        openInNewWindow: false,
        openInVSCode,
        autoLaunchVSCode,
        hasBetaEditorExperiment,
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
                url: sandboxUrl(forkedSandbox, hasBetaEditorExperiment),
              },
            },
            '*'
          );
        }
      });

    if (closeModal) {
      closeModal();
    }
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
            />
          </ModalContent>
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
