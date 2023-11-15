import {
  Text,
  Stack,
  Element,
  IconButton,
  SkeletonText,
  ThemeProvider,
} from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React, { ReactNode, useState, useEffect } from 'react';
import { TabStateReturn, useTabState } from 'reakit/Tab';
import slugify from '@codesandbox/common/lib/utils/slugify';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { TemplateFragment } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import {
  Container,
  Tab,
  TabContent,
  Tabs,
  HeaderInformation,
  ModalContent,
  ModalSidebar,
  ModalBody,
} from './elements';
import { TemplateList } from './TemplateList';
import { useEssentialTemplates } from './hooks/useEssentialTemplates';
import { useOfficialTemplates } from './hooks/useOfficialTemplates';
import { useTeamTemplates } from './hooks/useTeamTemplates';
import { CreateSandboxParams } from './utils/types';

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

interface PanelProps {
  tab: TabStateReturn;
  id: string;
  children: ReactNode;
}

/**
 * The Panel component handles the conditional rendering of the actual panel content. This is
 * done with render props as per the Reakit docs.
 */
const Panel = ({ tab, id, children }: PanelProps) => {
  return (
    <TabContent {...tab} stopId={id}>
      {({ hidden, ...rest }) =>
        hidden ? null : <div {...rest}>{children}</div>
      }
    </TabContent>
  );
};

interface CreateBoxProps {
  collectionId?: string;
  isModal?: boolean;
  type?: 'devbox' | 'sandbox';
}

export const CreateBox: React.FC<CreateBoxProps> = ({
  collectionId,
  type = 'devbox',
  isModal,
}) => {
  const { hasLogIn, activeTeamInfo, user } = useAppState();
  const actions = useActions();

  const isUser = user?.username === activeTeamInfo?.name;
  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const essentialState = useEssentialTemplates();
  const officialTemplatesData = useOfficialTemplates();
  const teamTemplatesData = useTeamTemplates({
    isUser,
    teamId: activeTeamInfo?.id,
    hasLogIn,
  });

  const officialTemplates =
    officialTemplatesData.state === 'ready'
      ? officialTemplatesData.templates
      : [];

  /**
   * Checking for user because user is undefined when landing on /s/, even though
   * hasLogIn is true. Only show the team/my templates if the list is populated.
   */
  const showTeamTemplates =
    hasLogIn &&
    user &&
    teamTemplatesData.state === 'ready' &&
    teamTemplatesData.teamTemplates.length > 0;

  /**
   * For the quick start we show:
   *  - 3 most recently used templates (if they exist)
   *  - 6 to 9 templates selected from the official list, ensuring the total number
   * of unique templates is 9 (recent + official)
   */
  const recentlyUsedTemplates =
    teamTemplatesData.state === 'ready'
      ? teamTemplatesData.recentTemplates.slice(0, 3)
      : [];

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
    featuredOfficialTemplates.length > 0 ? 6 : 9
  );

  const teamTemplates =
    teamTemplatesData.state === 'ready' ? teamTemplatesData.teamTemplates : [];

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: 'featured',
  });

  const [viewState, setViewState] = useState<'initial' | 'fromTemplate'>(
    'initial'
  );

  const [searchQuery, setSearchQuery] = useState<string>('');

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
    if (searchQuery && tabState.selectedId) {
      setSearchQuery('');
    }
  }, [tabState.selectedId]);

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
      },
    });

    actions.modals.newSandboxModal.close();
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
              onClick={() => actions.modals.newSandboxModal.close()}
            />
          ) : null}
        </Stack>

        <ModalBody>
          <ModalSidebar>
            {viewState === 'initial' ? (
              <Stack direction="vertical">
                <Tabs {...tabState} aria-label="Create new">
                  <Tab
                    {...tabState}
                    onClick={() => trackTabClick('featured')}
                    stopId="featured"
                  >
                    Featured templates
                  </Tab>

                  <Element css={{ height: '18px' }} />

                  {showTeamTemplates ? (
                    <Tab
                      {...tabState}
                      onClick={() => trackTabClick('team-templates')}
                      stopId="team-templates"
                    >
                      {`${isUser ? 'My' : 'Team'} templates`}
                    </Tab>
                  ) : null}

                  <Tab
                    {...tabState}
                    onClick={() => trackTabClick('official-templates')}
                    stopId="official-templates"
                  >
                    Official templates
                  </Tab>

                  {essentialState.state === 'success'
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

                  {!mobileScreenSize && essentialState.state === 'loading' ? (
                    <Stack direction="vertical" css={{ marginTop: 6 }} gap={5}>
                      <SkeletonText css={{ width: 110 }} />
                      <SkeletonText css={{ width: 60 }} />
                      <SkeletonText css={{ width: 50 }} />
                      <SkeletonText css={{ width: 80 }} />
                      <SkeletonText css={{ width: 140 }} />
                      <SkeletonText css={{ width: 70 }} />
                    </Stack>
                  ) : null}

                  {essentialState.state === 'error' ? (
                    <div>{essentialState.error}</div>
                  ) : null}
                </Tabs>
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
                  <TemplateList
                    title="Recently used"
                    templates={recentlyUsedTemplates}
                    onSelectTemplate={template => {
                      selectTemplate(template, 'Featured templates');
                    }}
                    onOpenTemplate={template => {
                      openTemplate(template, 'Featured templates');
                    }}
                  />
                  <TemplateList
                    title="Popular"
                    templates={featuredTemplates}
                    onSelectTemplate={template => {
                      selectTemplate(template, 'Featured templates');
                    }}
                    onOpenTemplate={template => {
                      openTemplate(template, 'Featured templates');
                    }}
                  />
                </Panel>

                {showTeamTemplates ? (
                  <Panel tab={tabState} id="team-templates">
                    <TemplateList
                      title={`${
                        isUser ? 'My' : activeTeamInfo?.name || 'Team'
                      } templates`}
                      templates={teamTemplates}
                      onSelectTemplate={template => {
                        selectTemplate(template, 'team-templates');
                      }}
                      onOpenTemplate={template => {
                        openTemplate(template, 'team-templates');
                      }}
                    />
                  </Panel>
                ) : null}

                <Panel tab={tabState} id="official-templates">
                  <TemplateList
                    title="Official templates"
                    templates={officialTemplates}
                    onSelectTemplate={template => {
                      selectTemplate(template, 'official-templates');
                    }}
                    onOpenTemplate={template => {
                      openTemplate(template, 'official-templates');
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
