import {
  Text,
  Stack,
  Element,
  IconButton,
  ThemeProvider,
} from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React, { useState, useEffect } from 'react';
import { useTabState } from 'reakit/Tab';
import slugify from '@codesandbox/common/lib/utils/slugify';
import { TemplateFragment } from 'app/graphql/types';
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
  SandboxAlternative,
} from './elements';
import { TemplateList } from './TemplateList';
import { useTemplateCollections } from './hooks/useTemplateCollections';
import { useOfficialTemplates } from './hooks/useOfficialTemplates';
import { useTeamTemplates } from './hooks/useTeamTemplates';
import { CreateParams } from './utils/types';
import { SearchBox } from './SearchBox';
import { ImportTemplate } from './ImportTemplate';
import { CreateBoxForm } from './CreateBox/CreateBoxForm';
import { TemplateInfo } from './CreateBox/TemplateInfo';
import { useFeaturedTemplates } from './hooks/useFeaturedTemplates';
import { useAllTemplates } from './hooks/useAllTemplates';

export const COLUMN_MEDIA_THRESHOLD = 1600;

type CreateBoxProps = ModalContentProps & {
  collectionId?: string;
  type?: 'devbox' | 'sandbox';
};

export const CreateBox: React.FC<CreateBoxProps> = ({
  collectionId: initialCollectionId,
  type = 'devbox',
  closeModal,
}) => {
  const { hasLogIn, activeTeam } = useAppState();
  const actions = useActions();
  const { isFrozen } = useWorkspaceLimits();
  const [collectionId, setCollectionId] = useState<string | undefined>(
    initialCollectionId
  );

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const showFeaturedTemplates = type === 'devbox';
  const showCollections = type === 'devbox';

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: type === 'devbox' ? 'featured' : 'all',
  });

  const [viewState, setViewState] = useState<'initial' | 'fromTemplate'>(
    'initial'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFragment>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoLaunchVSCode] = useGlobalPersistedState(
    'AUTO_LAUNCH_VSCODE',
    false
  );

  const { collections } = useTemplateCollections({ type });
  const { templates: officialTemplates } = useOfficialTemplates({ type });
  const { teamTemplates, recentTemplates } = useTeamTemplates({
    teamId: activeTeam,
    hasLogIn,
    type,
  });

  const recentlyUsedTemplates = recentTemplates.slice(0, 3);
  const featuredTemplates = useFeaturedTemplates({
    officialTemplates,
    recentTemplates,
  });

  const allTemplates = useAllTemplates({
    featuredTemplates,
    officialTemplates,
    teamTemplates,
    collections,
    searchQuery,
  });

  /**
   * Only show the team templates if the list is populated.
   */
  const hasRecentlyUsedTemplates = recentlyUsedTemplates.length > 0;
  const showTeamTemplates = teamTemplates.length > 0;
  const showImportTemplates = hasLogIn && activeTeam && type === 'devbox';

  useEffect(() => {
    if (searchQuery) {
      track(`Create ${type} - Search Templates`, {
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
    template: TemplateFragment,
    { name, createAs, permission, editor, customVMTier }: CreateParams
  ) => {
    const { sandbox } = template;
    const openInVSCode = editor === 'vscode';

    track(`Create ${type} - Create`, {
      type: 'fork',
      title: name,
      template_name:
        template.sandbox.title || template.sandbox.alias || template.sandbox.id,
      open_in_editor: editor,
      ...(customVMTier ? { vm_tier: customVMTier } : {}),
    });

    actions.editor.forkExternalSandbox({
      sandboxId: sandbox.id,
      openInNewWindow: false,
      openInVSCode,
      autoLaunchVSCode,
      hasBetaEditorExperiment,
      customVMTier,
      body: {
        title: name,
        collectionId,
        privacy: permission,
        v2: createAs === 'devbox',
      },
    });

    closeModal();
  };

  const selectTemplate = (
    template: TemplateFragment,
    trackingSource: string
  ) => {
    const { sandbox } = template;
    if (!hasLogIn) {
      // Open template in editor for anonymous users
      window.location.href = sandboxUrl(sandbox, hasBetaEditorExperiment);
      return;
    }

    setSelectedTemplate(template);
    setViewState('fromTemplate');

    track(`Create ${type} - Select template`, {
      type: 'fork',
      tab_name: trackingSource,
      template_name:
        template.sandbox.title || template.sandbox.alias || template.sandbox.id,
    });
  };

  const openTemplate = (template: TemplateFragment, trackingSource: string) => {
    const { sandbox } = template;
    const url = sandboxUrl(sandbox, hasBetaEditorExperiment);
    window.open(url, '_blank');

    track(`Create ${type} - Open template`, {
      type: 'open',
      tab_name: trackingSource,
      template_name:
        template.sandbox.title || template.sandbox.alias || template.sandbox.id,
    });
  };

  const trackTabClick = (tab: string) => {
    track(`Create ${type} - Click Tab`, {
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
            {viewState === 'initial' ? (
              <Text size={4} variant="muted">
                Create {type === 'devbox' ? 'Devbox' : 'Sandbox'}
              </Text>
            ) : (
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

          {mobileScreenSize && viewState === 'initial' ? (
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
          <ModalSidebar>
            {viewState === 'initial' ? (
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

                    {type === 'devbox' && <Element css={{ height: '16px' }} />}

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
                      {type === 'devbox'
                        ? "There's even more"
                        : 'Do more with Devboxes'}
                    </Text>
                    <Text size={2} color="#A6A6A6" lineHeight="1.35">
                      {type === 'devbox' ? (
                        <DevboxAlternative
                          onClick={() => {
                            track(`Create ${type} - Open Community Search`);
                          }}
                        />
                      ) : (
                        <SandboxAlternative
                          onClick={() => {
                            track(`Create ${type} - Open Devboxes`);
                            actions.modalOpened({
                              modal: 'createDevbox',
                            });
                          }}
                        />
                      )}
                    </Text>
                  </Stack>
                )}
              </Stack>
            ) : null}

            {viewState === 'fromTemplate' ? (
              <TemplateInfo template={selectedTemplate} />
            ) : null}
          </ModalSidebar>

          <ModalContent>
            {viewState === 'initial' && (
              <Stack direction="vertical" gap={2}>
                <Panel tab={tabState} id="featured">
                  {hasRecentlyUsedTemplates && (
                    <TemplateList
                      title="Recently used"
                      templates={recentlyUsedTemplates}
                      type={type}
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
                    type={type}
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
                    type={type}
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
                      type={type}
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
                    type={type}
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
                      type={type}
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
            )}

            {viewState === 'fromTemplate' ? (
              <CreateBoxForm
                type={type}
                collectionId={collectionId}
                setCollectionId={setCollectionId}
                onCancel={() => {
                  setViewState('initial');
                }}
                onSubmit={params => {
                  createFromTemplate(selectedTemplate, params);
                }}
                onClose={() => closeModal()}
              />
            ) : null}
          </ModalContent>
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};
