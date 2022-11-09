import {
  Badge,
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
import { Import } from './Import';
import { TemplateCategoryList } from './TemplateCategoryList';
import { useEssentialTemplates } from './useEssentialTemplates';
import { FromTemplate } from './FromTemplate';
import { useOfficialTemplates } from './useOfficialTemplates';
import { useTeamTemplates } from './useTeamTemplates';
import { CreateSandboxParams } from './types';
import { SearchBox } from './SearchBox';
import { SearchResults } from './SearchResults';
import { GithubRepoToImport } from './Import/types';
import { ImportInfo } from './Import/ImportInfo';
import { FromRepo } from './Import/FromRepo';

export const COLUMN_MEDIA_THRESHOLD = 1600;

const QUICK_START_IDS = [
  'new',
  'vanilla',
  'vue',
  'prp60l', // remix v2
  '9qputt', // vite + react v2
  'fxis37', // next v2
  // 'k8dsq1', // blank v2
  // '6xxu1m', // nuxt v2
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

interface CreateSandboxProps {
  collectionId?: string;
  initialTab?: 'import';
  isModal?: boolean;
}

export const CreateSandbox: React.FC<CreateSandboxProps> = ({
  collectionId,
  initialTab,
  isModal,
}) => {
  const { hasLogIn, activeTeamInfo, user } = useAppState();
  const actions = useActions();
  const isUnderRepositoriesSection =
    location.pathname.includes('/my-contributions') ||
    location.pathname.includes('/repositories');
  const defaultSelectedTab =
    initialTab || isUnderRepositoriesSection ? 'import' : 'quickstart';
  const isUser = user?.username === activeTeamInfo?.name;
  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  const essentialState = useEssentialTemplates();
  const officialTemplatesData = useOfficialTemplates();
  const teamTemplatesData = useTeamTemplates({
    isUser,
    teamId: activeTeamInfo?.id,
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

  const quickStartOfficialTemplates =
    officialTemplatesData.state === 'ready'
      ? QUICK_START_IDS.map(
          id =>
            // If the template is already in recently used, don't add it twice
            !recentlyUsedTemplates.find(t => t.sandbox.id === id) &&
            officialTemplates.find(t => t.sandbox.id === id)
        ).filter(Boolean)
      : [];

  const quickStartTemplates = [
    ...recentlyUsedTemplates,
    ...quickStartOfficialTemplates,
  ].slice(0, 9);

  const teamTemplates =
    teamTemplatesData.state === 'ready' ? teamTemplatesData.teamTemplates : [];

  const tabState = useTabState({
    orientation: mobileScreenSize ? 'horizontal' : 'vertical',
    selectedId: defaultSelectedTab,
  });

  const [viewState, setViewState] = useState<
    'initial' | 'fromTemplate' | 'fork'
  >('initial');
  // ❗️ We could combine viewState with selectedTemplate
  // and selectedRepo to limit the amount of states.
  const [selectedTemplate] = useState<TemplateFragment>();
  const [selectedRepo, setSelectedRepo] = useState<GithubRepoToImport>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (searchQuery && tabState.selectedId) {
      setSearchQuery('');
    }
  }, [tabState.selectedId]);

  const createFromTemplate = (
    template: TemplateFragment,
    { name }: CreateSandboxParams
  ) => {
    const { sandbox } = template;

    actions.editor.forkExternalSandbox({
      sandboxId: sandbox.id,
      openInNewWindow: false,
      body: {
        alias: name,
        collectionId,
      },
    });

    actions.modals.newSandboxModal.close();
  };

  const selectTemplate = (template: TemplateFragment) => {
    createFromTemplate(template, {});

    // Temporarily disable the second screen until we have more functionality on it
    // setSelectedTemplate(template);
    // setViewState('fromTemplate');
  };

  const openTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;
    const url = sandboxUrl(sandbox);
    window.open(url, '_blank');
  };

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

          {viewState === 'initial' ? (
            <SearchBox
              value={searchQuery}
              onChange={e => {
                const query = e.target.value;
                if (query) {
                  // Reset tab panel when typing in the search query box
                  tabState.select(null);
                } else {
                  // Restore the default tab when search query is removed
                  tabState.select(defaultSelectedTab);
                }

                setSearchQuery(query);
              }}
            />
          ) : null}

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
                    onClick={() => {
                      track('Create New - Click Quick Start', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                      });
                    }}
                    stopId="quickstart"
                  >
                    Quick start
                  </Tab>

                  <Tab
                    {...tabState}
                    onClick={() => {
                      track('Create New - Click Import from Github', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                      });
                    }}
                    stopId="import"
                  >
                    Import from GitHub
                  </Tab>

                  <Element css={{ height: '24px' }} />

                  {showTeamTemplates ? (
                    <Tab
                      {...tabState}
                      onClick={() => {
                        track(
                          `Create New - Click ${
                            isUser ? 'My' : 'Team'
                          } Templates`,
                          {
                            codesandbox: 'V1',
                            event_source: 'UI',
                          }
                        );
                      }}
                      stopId="team-templates"
                    >
                      {`${isUser ? 'My' : 'Team'} templates`}
                    </Tab>
                  ) : null}

                  <Tab
                    {...tabState}
                    onClick={() => {
                      track('Create New - Click Cloud templates', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                      });
                    }}
                    stopId="cloud-templates"
                  >
                    <Stack gap={2}>
                      <span>Cloud templates</span>
                      <Badge>Beta</Badge>
                    </Stack>
                  </Tab>

                  <Tab
                    {...tabState}
                    onClick={() => {
                      track('Create New - Click Official Templates', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                      });
                    }}
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
                          onClick={() => {
                            track(`Create New - Click ${essential.title}`, {
                              codesandbox: 'V1',
                              event_source: 'UI',
                            });
                          }}
                        >
                          {essential.title}
                        </Tab>
                      ))
                    : null}

                  {!mobileScreenSize && essentialState.state === 'loading' ? (
                    <Stack direction="vertical" css={{ marginTop: 6 }} gap={5}>
                      <SkeletonText css={{ width: 100 }} />
                      <SkeletonText css={{ width: 90 }} />
                      <SkeletonText css={{ width: 110 }} />
                      <SkeletonText css={{ width: 90 }} />
                      <SkeletonText css={{ width: 130 }} />
                      <SkeletonText css={{ width: 140 }} />
                      <SkeletonText css={{ width: 80 }} />
                      <SkeletonText css={{ width: 90 }} />
                      <SkeletonText css={{ width: 90 }} />
                      <SkeletonText css={{ width: 70 }} />
                    </Stack>
                  ) : null}

                  {essentialState.state === 'error' ? (
                    <div>{essentialState.error}</div>
                  ) : null}
                </Tabs>
              </Stack>
            ) : null}

            {viewState === 'fromTemplate' ? (
              <TemplateInfo template={selectedTemplate} />
            ) : null}
            {viewState === 'fork' ? (
              <ImportInfo githubRepo={selectedRepo} />
            ) : null}
          </ModalSidebar>

          <ModalContent>
            {viewState === 'initial' &&
              (searchQuery ? (
                <SearchResults
                  search={searchQuery}
                  onSelectTemplate={selectTemplate}
                  onOpenTemplate={openTemplate}
                />
              ) : (
                <>
                  <Panel tab={tabState} id="quickstart">
                    <TemplateCategoryList
                      title="Start from a template"
                      templates={quickStartTemplates}
                      onSelectTemplate={template => {
                        track('Create New - Fork Quickstart template', {
                          codesandbox: 'V1',
                          event_source: 'UI',
                        });

                        selectTemplate(template);
                      }}
                      onOpenTemplate={openTemplate}
                    />
                  </Panel>

                  <Panel tab={tabState} id="import">
                    <Import onRepoSelect={selectGithubRepo} />
                  </Panel>

                  {showTeamTemplates ? (
                    <Panel tab={tabState} id="team-templates">
                      <TemplateCategoryList
                        title={`${
                          isUser ? 'My' : activeTeamInfo?.name || 'Team'
                        } templates`}
                        templates={teamTemplates}
                        onSelectTemplate={template => {
                          track(
                            `Create New - Fork ${
                              isUser ? 'my' : 'team'
                            } template`,
                            { codesandbox: 'V1', event_source: 'UI' }
                          );

                          selectTemplate(template);
                        }}
                        onOpenTemplate={openTemplate}
                      />
                    </Panel>
                  ) : null}

                  <Panel tab={tabState} id="cloud-templates">
                    <TemplateCategoryList
                      title="Cloud templates"
                      templates={officialTemplates.filter(
                        template => template.sandbox.isV2
                      )}
                      onSelectTemplate={template => {
                        track('Create New - Fork Cloud template', {
                          codesandbox: 'V1',
                          event_source: 'UI',
                        });

                        selectTemplate(template);
                      }}
                      onOpenTemplate={openTemplate}
                      isCloudTemplateList
                    />
                  </Panel>

                  <Panel tab={tabState} id="official-templates">
                    <TemplateCategoryList
                      title="Official templates"
                      templates={officialTemplates}
                      onSelectTemplate={template => {
                        track('Create New - Fork Official template', {
                          codesandbox: 'V1',
                          event_source: 'UI',
                        });

                        selectTemplate(template);
                      }}
                      onOpenTemplate={openTemplate}
                    />
                  </Panel>

                  {essentialState.state === 'success'
                    ? essentialState.essentials.map(essential => (
                        <Panel
                          key={essential.key}
                          tab={tabState}
                          id={slugify(essential.title)}
                        >
                          <TemplateCategoryList
                            title={essential.title}
                            templates={essential.templates}
                            onSelectTemplate={template => {
                              track('Create New - Fork Essential template', {
                                codesandbox: 'V1',
                                event_source: 'UI',
                              });

                              selectTemplate(template);
                            }}
                            onOpenTemplate={openTemplate}
                          />
                        </Panel>
                      ))
                    : null}
                </>
              ))}

            {viewState === 'fromTemplate' ? (
              <FromTemplate
                isV2={selectedTemplate.sandbox.isV2}
                onCancel={() => {
                  setViewState('initial');
                }}
                onSubmit={params => {
                  createFromTemplate(selectedTemplate, params);
                }}
              />
            ) : null}

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

interface TemplateInfoProps {
  template: TemplateFragment;
}

const TemplateInfo = ({ template }: TemplateInfoProps) => {
  const { UserIcon } = getTemplateIcon(
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
          {template.sandbox.collection?.team?.name}
        </Text>
      </Stack>
      <Text size={2} css={{ color: '#999', lineHeight: '1.4' }}>
        {template.sandbox.description}
      </Text>
    </Stack>
  );
};
