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
import { GithubRepoAuthorization, TemplateFragment } from 'app/graphql/types';

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
import { CloudBetaBadge } from '../../CloudBetaBadge';
import { CreateSandboxParams } from './types';
import { SearchBox } from './SearchBox';
import { SearchResults } from './SearchResults';
import { GithubRepoToImport } from './Import/types';
import { ImportInfo } from './Import/ImportInfo';
import { FromRepo } from './Import/FromRepo';

export const COLUMN_MEDIA_THRESHOLD = 1600;

const QUICK_START_IDS = [
  'new',
  'rjk9n4zj7m', // static v1
  'k8dsq1', // blank v2
  'fxis37', // next v2
  'prp60l', // remix v2
  '6xxu1m', // nuxt (TODO: move it to v2 and make it official)
  'vue',
  'svelte',
  'angular',
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

  /**
   * Checking for user because user is undefined when landing on /s/, even though
   * hasLogIn is true.
   */
  const showTeamTemplates = hasLogIn && user;

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
  >('fork');
  // ❗️ We could combine viewState with selectedTemplate
  // and selectedRepo to limit the amount of states.
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFragment>();
  const [selectedRepo, setSelectedRepo] = useState<GithubRepoToImport>({
    __typename: 'GithubRepo',
    authorization: GithubRepoAuthorization.Read,
    fullName: 'facebook/react',
    name: 'react',
    owner: {
      __typename: 'GithubOrganization',
      avatarUrl: 'https://avatars.githubusercontent.com/u/69631?v=4',
      id: '69631',
      login: 'facebook',
    },
    updatedAt: '2022-10-04T15:29:15Z',
  });
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
    setSelectedTemplate(template);
    setViewState('fromTemplate');
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
                size={16}
                title="Back to overview"
                css={{
                  transform: 'rotate(90deg)',
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
                  <Tab {...tabState} stopId="quickstart">
                    Quick start
                  </Tab>

                  <Tab {...tabState} stopId="import">
                    Import from GitHub
                  </Tab>

                  <Element css={{ height: '24px' }} />

                  {showTeamTemplates ? (
                    <Tab {...tabState} stopId="team-templates">
                      {`${isUser ? 'My' : 'Team'} templates`}
                    </Tab>
                  ) : null}

                  <Tab {...tabState} stopId="cloud-templates">
                    <Stack gap={2}>
                      <span>Cloud templates</span>
                      <CloudBetaBadge hideIcon />
                    </Stack>
                  </Tab>

                  <Tab {...tabState} stopId="official-templates">
                    Official templates
                  </Tab>

                  {essentialState.state === 'success'
                    ? essentialState.essentials.map(essential => (
                        <Tab
                          key={essential.key}
                          {...tabState}
                          stopId={slugify(essential.title)}
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
                />
              ) : (
                <>
                  <Panel tab={tabState} id="quickstart">
                    <TemplateCategoryList
                      title="Start from a template"
                      templates={quickStartTemplates}
                      onSelectTemplate={selectTemplate}
                    />
                  </Panel>

                  <Panel tab={tabState} id="import">
                    <Import onRepoSelect={selectGithubRepo} />
                  </Panel>

                  {showTeamTemplates ? (
                    <Panel tab={tabState} id="team-templates">
                      <TemplateCategoryList
                        title={`${
                          isUser ? 'My' : activeTeamInfo.name
                        } templates`}
                        templates={teamTemplates}
                        onSelectTemplate={selectTemplate}
                      />
                    </Panel>
                  ) : null}

                  <Panel tab={tabState} id="cloud-templates">
                    <TemplateCategoryList
                      title="Cloud templates"
                      showBetaTag
                      templates={officialTemplates.filter(
                        template => template.sandbox.isV2
                      )}
                      onSelectTemplate={selectTemplate}
                    />
                  </Panel>

                  <Panel tab={tabState} id="official-templates">
                    <TemplateCategoryList
                      title="Official templates"
                      templates={officialTemplates}
                      onSelectTemplate={selectTemplate}
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
                            onSelectTemplate={selectTemplate}
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
              <FromRepo githubRepo={selectedRepo} />
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
        <Text size={3}>{template.sandbox.title}</Text>
        <Text size={2} css={{ color: '#808080' }}>
          {template.sandbox.collection?.team?.name}
        </Text>
      </Stack>
      <Text size={2} css={{ color: '#808080' }}>
        {template.sandbox.description}
      </Text>
    </Stack>
  );
};
