import {
  Stack,
  Element,
  IconButton,
  SkeletonText,
  ThemeProvider,
} from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React, { ReactNode, useState } from 'react';
import { TabStateReturn, useTabState } from 'reakit/Tab';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import slugify from '@codesandbox/common/lib/utils/slugify';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { TemplateFragment } from 'app/graphql/types';

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
import { TeamTemplates } from './TeamTemplates';
import { useEssentialTemplates } from './useEssentialTemplates';
import { FromTemplate } from './FromTemplate';
import { useOfficialTemplates } from './useOfficialTemplates';

export const COLUMN_MEDIA_THRESHOLD = 1600;

const QUICK_START_IDS = [
  'new',
  'vue',
  'vanilla',
  'angular',
  'rjk9n4zj7m', // static
  'remix',
  'uo1h0', // next
  'svelte',
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
  const essentialState = useEssentialTemplates();
  const officialTemplatesData = useOfficialTemplates();

  const officialTemplates =
    officialTemplatesData.state === 'ready'
      ? officialTemplatesData.templates
      : [];

  const isSyncedSandboxesPage = location.pathname.includes('/synced-sandboxes');
  const isUser = user?.username === activeTeamInfo?.name;

  /**
   * Checking for user because user is undefined when landing on /s/, even though
   * hasLogIn is true.
   */
  const showTeamTemplates = hasLogIn && user;

  const tabState = useTabState({
    orientation: 'vertical',
    selectedId: initialTab || isSyncedSandboxesPage ? 'import' : 'quickstart',
  });

  const [viewState, setViewState] = useState<
    'initial' | 'fromTemplate' | 'fork' /* | 'search' */
  >('initial');
  // ❗️ We could combine viewState with selectedtemplate to limit the amout of states.
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFragment>();

  const createFromTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;

    actions.editor.forkExternalSandbox({
      sandboxId: sandbox.id,
      openInNewWindow: false, // TODO: Implement Cmd+Click?
      body: {
        collectionId,
      },
    });

    actions.modals.newSandboxModal.close();
  };

  const selectTemplate = (template: TemplateFragment) => {
    setSelectedTemplate(template);
    setViewState('fromTemplate');
  };

  return (
    <ThemeProvider>
      <Container>
        <Stack gap={4} align="center" css={{ width: '100%', padding: '24px' }}>
          <HeaderInformation>
            {viewState === 'initial' ? (
              <div>New</div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setViewState('initial');
                  }}
                >
                  <VisuallyHidden>Back to overview</VisuallyHidden>
                  ArrowLeft
                </button>
              </div>
            )}
          </HeaderInformation>

          {viewState === 'initial' ? (
            <div>
              {/* ❗️ TODO: Search */}
              search
            </div>
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
                    Quickstart
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
                    Cloud templates (beta)
                  </Tab>

                  <Tab {...tabState} stopId="official-templates">
                    Official templates
                  </Tab>

                  <Tab {...tabState} stopId="popular-templates">
                    Most popular
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

                  {essentialState.state === 'loading' ? (
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
              <div>
                <TemplateInfo template={selectedTemplate} />
              </div>
            ) : null}
            {viewState === 'fork' ? <div>Repo info</div> : null}
          </ModalSidebar>

          <ModalContent>
            {viewState === 'initial' ? (
              <>
                <Panel tab={tabState} id="quickstart">
                  <TemplateCategoryList
                    title="Start from a template"
                    templates={officialTemplates.filter(template =>
                      QUICK_START_IDS.includes(template.sandbox.id)
                    )}
                    onSelectTemplate={createFromTemplate}
                  />
                </Panel>

                <Panel tab={tabState} id="import">
                  <Import />
                </Panel>

                {showTeamTemplates ? (
                  <Panel tab={tabState} id="team-templates">
                    <TeamTemplates
                      isUser={isUser}
                      teamId={activeTeamInfo.id}
                      onSelectTemplate={selectTemplate}
                    />
                  </Panel>
                ) : null}

                <Panel tab={tabState} id="cloud-templates">
                  <TemplateCategoryList
                    title="Cloud templates (beta)"
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

                <Panel tab={tabState} id="popular-templates">
                  <TemplateCategoryList
                    title="Most popular"
                    /* TODO: Figure out criteria for popular */
                    templates={[]}
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
            ) : null}

            {viewState === 'fromTemplate' ? (
              <FromTemplate
                onCancel={() => {
                  setViewState('initial');
                }}
              />
            ) : null}

            {viewState === 'fork' ? <div>Repo fork form fields</div> : null}
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
    <Stack direction="vertical">
      <UserIcon />
      <span>{template.sandbox.title}</span>
      <span>{template.sandbox.collection?.team?.name}</span>
      <p>{template.sandbox.description}</p>
    </Stack>
  );
};
