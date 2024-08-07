import {
  Text,
  Stack,
  Element,
  Loading,
  IconButton,
  ThemeProvider,
} from '@codesandbox/components';
import { useActions, useAppState, useEffects } from 'app/overmind';
import React, { useState, useEffect } from 'react';
import { useTabState } from 'reakit/Tab';
import slugify from '@codesandbox/common/lib/utils/slugify';
import track from '@codesandbox/common/lib/utils/analytics';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import { useBetaSandboxEditor } from 'app/hooks/useBetaSandboxEditor';
import { pluralize } from 'app/utils/pluralize';
import { ModalContentProps } from 'app/pages/common/Modals';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import {
  Container,
  Tab,
  Tabs,
  Panel,
  HeaderInformation,
  ModalContent,
  ModalSidebar,
  ModalBody,
  DevboxAlternative,
} from './elements';
import { TemplateList } from './TemplateList';
import { useTeamTemplates } from './hooks/useTeamTemplates';
import { CreateParams, SandboxToFork } from './utils/types';
import { SearchBox } from './SearchBox';
import { ImportTemplate } from './ImportTemplate';
import { CreateBoxForm } from './CreateBox/CreateBoxForm';
import { TemplateInfo } from './CreateBox/TemplateInfo';
import {
  getTemplatesInCollections,
  getAllMatchingTemplates,
  mapSandboxGQLResponseToSandboxToFork,
  parsePrivacy,
} from './utils/api';
import { WorkspaceSelect } from '../WorkspaceSelect';
import { FEATURED_IDS } from './utils/constants';

type CreateBoxProps = ModalContentProps & {
  collectionId?: string;
  sandboxIdToFork?: string;
  isStandalone?: boolean;
};

export const CreateBox: React.FC<CreateBoxProps> = ({
  collectionId: initialCollectionId,
  sandboxIdToFork,
  closeModal,
  isStandalone,
}) => {
  const { hasLogIn, activeTeam, officialTemplates } = useAppState();
  const effects = useEffects();
  const actions = useActions();
  const { isFrozen } = useWorkspaceLimits();
  const [collectionId, setCollectionId] = useState<string | undefined>(
    initialCollectionId
  );

  const parsedUrl = new URL(window.location.href);
  const initialPrivacy = parsePrivacy(parsedUrl.searchParams.get('privacy'));

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const showFeaturedTemplates = true;
  const showCollections = true;

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: 'featured',
  });

  const [viewState, setViewState] = useState<'select' | 'loading' | 'config'>(
    'select'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<SandboxToFork>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoLaunchVSCode] = useGlobalPersistedState(
    'AUTO_LAUNCH_VSCODE',
    false
  );

  const collections = getTemplatesInCollections(officialTemplates, [
    { tag: 'frontend', title: 'Frontend frameworks' },
    { tag: 'backend', title: 'Backend frameworks' },
    { tag: 'playground', title: 'Code playgrounds' },
    { tag: 'starter', title: 'Project starters' },
  ]);

  const { teamTemplates, recentTemplates } = useTeamTemplates({
    teamId: activeTeam,
    hasLogIn,
  });

  const recentlyUsedTemplates = recentTemplates.slice(0, 3);
  const hasRecentlyUsedTemplates = recentlyUsedTemplates.length > 0;
  const recentlyUsedTemplatesIds = recentlyUsedTemplates.map(t => t.id);

  const featuredTemplates = FEATURED_IDS.map(id =>
    officialTemplates.find(
      t => t.id === id && !recentlyUsedTemplatesIds.includes(t.id)
    )
  )
    .filter(Boolean)
    .slice(0, hasRecentlyUsedTemplates ? 6 : 9);

  const allTemplates = getAllMatchingTemplates({
    officialTemplates,
    teamTemplates,
    searchQuery,
  });

  /**
   * Only show the team templates if the list is populated.
   */

  const showTeamTemplates = teamTemplates.length > 0;
  const showImportTemplates = hasLogIn && activeTeam;

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

  useEffect(() => {
    if (searchQuery && tabState.selectedId !== 'all') {
      setSearchQuery('');
    }
  }, [searchQuery, tabState.selectedId]);

  const [hasBetaEditorExperiment] = useBetaSandboxEditor();

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
        sandboxId: sandbox.browserSandboxId ?? sandbox.id,
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

  const selectTemplate = (sandbox: SandboxToFork, trackingSource: string) => {
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
      tab_name: trackingSource,
      template_name: sandbox.title || sandbox.alias || sandbox.id,
    });
  };

  const openTemplate = (sandbox: SandboxToFork, trackingSource: string) => {
    const url =
      sandbox.editorUrl || sandboxUrl(sandbox, hasBetaEditorExperiment);
    window.open(url, '_blank');

    track(`Create - Open template`, {
      type: 'open',
      tab_name: trackingSource,
      template_name: sandbox.title || sandbox.alias || sandbox.id,
    });
  };

  const trackTabClick = (tab: string) => {
    track(`Create - Click Tab`, {
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
            {viewState === 'select' && <Text size={4}>New</Text>}
            {viewState === 'config' && !sandboxIdToFork && (
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
            )}
          </HeaderInformation>

          {mobileScreenSize && viewState === 'select' ? (
            <SearchBox
              value={searchQuery}
              onChange={e => {
                const query = e.target.value;
                tabState.select('all');
                setSearchQuery(query);
              }}
            />
          ) : null}
        </Stack>

        <ModalBody>
          {viewState === 'loading' && (
            <Stack css={{ width: '100%' }} align="center" justify="center">
              <Loading size={12} />
            </Stack>
          )}

          {viewState === 'select' && (
            <>
              <ModalSidebar>
                <Stack
                  css={{ height: '100%' }}
                  direction="vertical"
                  justify="space-between"
                >
                  <Stack direction="vertical">
                    {!mobileScreenSize && (
                      <>
                        <SearchBox
                          value={searchQuery}
                          onChange={e => {
                            const query = e.target.value;
                            tabState.select('all');
                            setSearchQuery(query);
                          }}
                        />

                        <Element css={{ height: '16px' }} />
                      </>
                    )}

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
              </ModalSidebar>
              <ModalContent>
                <Stack direction="vertical" gap={2}>
                  <Panel tab={tabState} id="featured">
                    {hasRecentlyUsedTemplates && (
                      <TemplateList
                        title="Recently used"
                        templates={recentlyUsedTemplates}
                        onSelectTemplate={template => {
                          selectTemplate(template, 'featured');
                        }}
                        onOpenTemplate={template => {
                          openTemplate(template, 'featured');
                        }}
                      />
                    )}
                    <TemplateList
                      title="Popular"
                      templates={featuredTemplates}
                      onSelectTemplate={template => {
                        selectTemplate(template, 'featured');
                      }}
                      onOpenTemplate={template => {
                        openTemplate(template, 'featured');
                      }}
                    />
                  </Panel>

                  <Panel tab={tabState} id="all">
                    <TemplateList
                      title={
                        searchQuery
                          ? `${allTemplates.length} ${pluralize({
                              word: 'result',
                              count: allTemplates.length,
                            })}`
                          : 'All templates'
                      }
                      templates={allTemplates}
                      searchQuery={searchQuery}
                      showEmptyState
                      onSelectTemplate={template => {
                        selectTemplate(template, 'all');
                      }}
                      onOpenTemplate={template => {
                        openTemplate(template, 'all');
                      }}
                    />
                  </Panel>

                  {showTeamTemplates ? (
                    <Panel tab={tabState} id="workspace">
                      <TemplateList
                        title="Workspace templates"
                        templates={teamTemplates}
                        onSelectTemplate={template => {
                          selectTemplate(template, 'workspace');
                        }}
                        onOpenTemplate={template => {
                          openTemplate(template, 'workspace');
                        }}
                      />
                    </Panel>
                  ) : null}

                  {showImportTemplates ? (
                    <Panel tab={tabState} id="import-template">
                      <ImportTemplate />
                    </Panel>
                  ) : null}

                  <Panel tab={tabState} id="official">
                    <TemplateList
                      title="Official templates"
                      templates={officialTemplates}
                      onSelectTemplate={template => {
                        selectTemplate(template, 'official');
                      }}
                      onOpenTemplate={template => {
                        openTemplate(template, 'official');
                      }}
                    />
                  </Panel>

                  {collections.map(collection => (
                    <Panel
                      key={collection.key}
                      tab={tabState}
                      id={slugify(collection.title)}
                    >
                      <TemplateList
                        title={collection.title}
                        templates={collection.templates}
                        onSelectTemplate={template => {
                          selectTemplate(template, collection.title);
                        }}
                        onOpenTemplate={template => {
                          openTemplate(template, collection.title);
                        }}
                      />
                    </Panel>
                  ))}
                </Stack>
              </ModalContent>
            </>
          )}

          {viewState === 'config' && (
            <>
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
            </>
          )}
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
