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
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { TemplateFragment } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { pluralize } from 'app/utils/pluralize';
import { ModalContentProps } from 'app/pages/common/Modals';
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
import { useEssentialTemplates } from './hooks/useEssentialTemplates';
import { useOfficialTemplates } from './hooks/useOfficialTemplates';
import { useTeamTemplates } from './hooks/useTeamTemplates';
import { CreateSandboxParams } from './utils/types';
import { SearchBox } from './SearchBox';

export const COLUMN_MEDIA_THRESHOLD = 1600;

const FEATURED_IDS = [
  'new',
  'vanilla',
  'vue',
  'hsd8ke', // docker starter v2
  'fxis37', // next v2
  '9qputt', // vite + react v2
  'prp60l', // remix v2
  'angular',
  'react-ts',
  'rjk9n4zj7m', // static v1
];

type CreateBoxProps = ModalContentProps & {
  collectionId?: string;
  type?: 'devbox' | 'sandbox';
  isModal: boolean;
};

export const CreateBox: React.FC<CreateBoxProps> = ({
  collectionId,
  type = 'devbox',
  closeModal,
  isModal,
}) => {
  const { hasLogIn, activeTeam } = useAppState();
  const actions = useActions();

  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const showFeaturedTemplates = type === 'devbox';
  const showEssentialTemplates = type === 'devbox';

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: type === 'devbox' ? 'featured' : 'all',
  });

  const [viewState, setViewState] = useState<'initial' | 'fromTemplate'>(
    'initial'
  );
  const [selectedTemplate] = useState<TemplateFragment>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const noDevboxesWhenListingSandboxes = (t: TemplateFragment) =>
    type === 'sandbox' ? !t.sandbox.isV2 : true;

  const essentialState = useEssentialTemplates(showEssentialTemplates);
  const officialTemplatesData = useOfficialTemplates();
  const teamTemplatesData = useTeamTemplates({
    teamId: activeTeam,
    hasLogIn,
  });

  const officialTemplates =
    officialTemplatesData.state === 'ready'
      ? officialTemplatesData.templates.filter(noDevboxesWhenListingSandboxes)
      : [];

  /**
   * Only show the team templates if the list is populated.
   */
  const showTeamTemplates =
    hasLogIn &&
    activeTeam &&
    teamTemplatesData.state === 'ready' &&
    teamTemplatesData.teamTemplates.length > 0;

  const recentlyUsedTemplates =
    teamTemplatesData.state === 'ready'
      ? teamTemplatesData.recentTemplates.slice(0, 3)
      : [];

  const hasRecentlyUsedTemplates = recentlyUsedTemplates.length > 0;

  const featuredOfficialTemplates =
    officialTemplatesData.state === 'ready'
      ? FEATURED_IDS.map(
          id =>
            // If the template is already in recently used, don't add it twice
            !recentlyUsedTemplates.find(t => t.sandbox.id === id) &&
            officialTemplates.find(t => t.sandbox.id === id)
        ).filter(Boolean)
      : [];

  const featuredTemplates = featuredOfficialTemplates.slice(
    0,
    hasRecentlyUsedTemplates ? 6 : 9
  );

  const teamTemplates =
    teamTemplatesData.state === 'ready'
      ? teamTemplatesData.teamTemplates.filter(noDevboxesWhenListingSandboxes)
      : [];

  const allTemplates = [...officialTemplates, ...teamTemplates]
    .filter(noDevboxesWhenListingSandboxes)
    .filter(t =>
      searchQuery
        ? (t.sandbox.alias || t.sandbox.alias || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true
    );

  useEffect(() => {
    if (searchQuery) {
      track('Create New - Search Templates', {
        query: searchQuery,
        codesandbox: 'V1',
        event_source: 'UI',
      });
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery && tabState.selectedId !== 'all') {
      setSearchQuery('');
    }
  }, [searchQuery, tabState.selectedId]);

  const [hasBetaEditorExperiment] = useGlobalPersistedState(
    'BETA_SANDBOX_EDITOR',
    false
  );

  const createFromTemplate = (
    template: TemplateFragment,
    { name }: CreateSandboxParams
  ) => {
    const { sandbox } = template;

    actions.editor.forkExternalSandbox({
      sandboxId: sandbox.id,
      openInNewWindow: false,
      hasBetaEditorExperiment,
      body: {
        alias: name,
        collectionId,
        v2: type === 'devbox',
      },
    });

    closeModal();
  };

  const selectTemplate = (
    template: TemplateFragment,
    trackingSource: string
  ) => {
    track('Create New - Select template', {
      codesandbox: 'V1',
      event_source: 'UI',
      type: 'fork',
      tab_name: trackingSource,
      template_name:
        template.sandbox.title || template.sandbox.alias || template.sandbox.id,
    });

    createFromTemplate(template, {});

    // Temporarily disable the second screen until we have more functionality on it
    // setSelectedTemplate(template);
    // setViewState('fromTemplate');
  };

  const openTemplate = (template: TemplateFragment, trackingSource: string) => {
    const { sandbox } = template;
    const url = sandboxUrl(sandbox, hasBetaEditorExperiment);
    window.open(url, '_blank');

    track('Create New - Select template', {
      codesandbox: 'V1',
      event_source: 'UI',
      type: 'open',
      tab_name: trackingSource,
      template_name:
        template.sandbox.title || template.sandbox.alias || template.sandbox.id,
    });
  };

  const trackTabClick = (tab: string) => {
    track('Create New - Click Tab', {
      codesandbox: 'V1',
      event_source: 'UI',
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
              <Stack
                css={{ height: '100%', paddingBottom: '16px' }}
                direction="vertical"
                justify="space-between"
              >
                <Stack direction="vertical">
                  <SearchBox
                    value={searchQuery}
                    onChange={e => {
                      const query = e.target.value;
                      tabState.select('all');
                      setSearchQuery(query);
                    }}
                  />

                  <Element css={{ height: '16px' }} />

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

                    <Tab
                      {...tabState}
                      onClick={() => trackTabClick('official')}
                      stopId="official"
                    >
                      Official templates
                    </Tab>

                    <Element css={{ height: '16px' }} />

                    {showEssentialTemplates &&
                    essentialState.state === 'success'
                      ? essentialState.essentials.map(essential => (
                          <Tab
                            key={essential.key}
                            {...tabState}
                            stopId={slugify(essential.title)}
                            onClick={() => trackTabClick(essential.title)}
                          >
                            {essential.title}
                          </Tab>
                        ))
                      : null}
                  </Tabs>
                </Stack>
                <Stack direction="vertical" gap={2}>
                  <Text size={3} weight="600">
                    {type === 'devbox'
                      ? "There's even more"
                      : 'Do more with Devboxes'}
                  </Text>
                  <Text size={2} color="#A6A6A6" lineHeight="1.35">
                    {type === 'devbox' ? (
                      <DevboxAlternative />
                    ) : (
                      <SandboxAlternative
                        onClick={() => {
                          actions.modalOpened({
                            modal: 'createDevbox',
                          });
                        }}
                      />
                    )}
                  </Text>
                </Stack>
              </Stack>
            ) : null}

            {/* {viewState === 'fromTemplate' ? (
              <TemplateInfo template={selectedTemplate} />
            ) : null} */}
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
                    key={searchQuery}
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

                {essentialState.state === 'success'
                  ? essentialState.essentials.map(essential => (
                      <Panel
                        key={essential.key}
                        tab={tabState}
                        id={slugify(essential.title)}
                      >
                        <TemplateList
                          title={essential.title}
                          templates={essential.templates}
                          type={type}
                          onSelectTemplate={template => {
                            selectTemplate(template, essential.title);
                          }}
                          onOpenTemplate={template => {
                            openTemplate(template, essential.title);
                          }}
                        />
                      </Panel>
                    ))
                  : null}
              </Stack>
            )}

            {/* {viewState === 'fromTemplate' ? (
              <FromTemplate
                isV2={selectedTemplate.sandbox.isV2}
                onCancel={() => {
                  setViewState('initial');
                }}
                onSubmit={params => {
                  createFromTemplate(selectedTemplate, params);
                }}
              />
            ) : null} */}
          </ModalContent>
        </ModalBody>
      </Container>
    </ThemeProvider>
  );
};

interface TemplateInfoProps {
  template: TemplateFragment;
}

const TemplateInfo = ({ template }: TemplateInfoProps) => {
  const { UserIcon } = getTemplateIcon(
    template.sandbox.title,
    template.iconUrl,
    template.sandbox?.source?.template
  );

  return (
    <Stack direction="vertical" gap={6}>
      <UserIcon />
      <Stack direction="vertical">
        <Text size={3} weight="500">
          {template.sandbox.title}
        </Text>
        <Text size={2} css={{ color: '#999', marginTop: '4px' }}>
          {template.sandbox?.team?.name}
        </Text>
      </Stack>
      <Text size={2} css={{ color: '#999', lineHeight: '1.4' }}>
        {template.sandbox.description}
      </Text>
    </Stack>
  );
};
