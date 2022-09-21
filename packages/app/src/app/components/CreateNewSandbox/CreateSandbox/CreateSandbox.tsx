import { Stack, SkeletonText, ThemeProvider } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React, { ReactNode, useState } from 'react';
import { TabStateReturn, useTabState } from 'reakit/Tab';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import slugify from '@codesandbox/common/lib/utils/slugify';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { TemplateFragment } from 'app/graphql/types';

import { QuickStart } from './QuickStart';
import {
  Container,
  Tab,
  TabContent,
  Tabs,
  ModalLayout,
  ModalHeader,
  HeaderInformation,
  ModalContent,
  ModalSidebar,
  ModalBody,
} from './elements';
import { Explore } from './Explore';
import { Import } from './Import';
import { Essentials } from './Essentials';
import { TeamTemplates } from './TeamTemplates';
import { CodeSandboxTemplates } from './CodeSandboxTemplates';
import { useEssentialTemplates } from './useEssentialTemplates';

export const COLUMN_MEDIA_THRESHOLD = 1600;

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

  const isSyncedSandboxesPage = location.pathname.includes('/synced-sandboxes');
  const isUser = user?.username === activeTeamInfo?.name;

  /**
   * Checking for user because user is undefined when landing on /s/, even though
   * hasLogIn is true.
   */
  const showTeamTemplates = hasLogIn && user;

  const tab = useTabState({
    orientation: 'vertical',
    selectedId: initialTab || isSyncedSandboxesPage ? 'import' : 'quickstart',
  });

  const [viewState, setViewState] = useState<
    'initial' | 'fromTemplate' | 'fork' /* | 'search' */
  >('initial');
  // ❗️ We could combine viewState with selectedtemplate to limit the amout of states.
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFragment>();

  const selectTemplate = (template: TemplateFragment) => {
    setSelectedTemplate(template);
    setViewState('fromTemplate');
  };

  return (
    <ThemeProvider>
      <Container>
        <ModalLayout>
          <ModalHeader>
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
              <button
                type="button"
                onClick={() => actions.modals.newSandboxModal.close()}
              >
                Close button
              </button>
            ) : null}
          </ModalHeader>

          <ModalBody>
            <ModalSidebar>
              {viewState === 'initial' ? (
                <Stack direction="vertical">
                  <Tabs {...tab} aria-label="Create new">
                    <Tab {...tab} stopId="quickstart">
                      Quickstart
                    </Tab>

                    <Tab {...tab} stopId="import">
                      Import from GitHub
                    </Tab>

                    {showTeamTemplates ? (
                      <Tab {...tab} stopId="team-templates">
                        {`${isUser ? 'My' : 'Team'} templates`}
                      </Tab>
                    ) : null}

                    <Tab {...tab} stopId="csb-templates">
                      CodeSandbox templates
                    </Tab>

                    {essentialState.state === 'success'
                      ? essentialState.essentials.map(essential => (
                          <Tab
                            key={essential.key}
                            {...tab}
                            stopId={slugify(essential.title)}
                          >
                            {essential.title}
                          </Tab>
                        ))
                      : null}

                    {essentialState.state === 'loading' ? (
                      <div>
                        <div>todo skeletons</div>
                        <SkeletonText css={{ width: 100 }} />
                      </div>
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
                  <Panel tab={tab} id="quickstart">
                    <QuickStart collectionId={collectionId} />
                  </Panel>

                  <Panel tab={tab} id="import">
                    <Import />
                  </Panel>

                  <Panel tab={tab} id="explore">
                    <Explore collectionId={collectionId} />
                  </Panel>

                  {showTeamTemplates ? (
                    <Panel tab={tab} id="team-templates">
                      <TeamTemplates
                        isUser={isUser}
                        teamId={activeTeamInfo.id}
                      />
                    </Panel>
                  ) : null}

                  <Panel tab={tab} id="csb-templates">
                    <CodeSandboxTemplates />
                  </Panel>

                  {essentialState.state === 'success'
                    ? essentialState.essentials.map(essential => (
                        <Panel
                          key={essential.key}
                          tab={tab}
                          id={slugify(essential.title)}
                        >
                          <Essentials
                            title={essential.title}
                            templates={essential.templates}
                            selectTemplate={selectTemplate}
                          />
                        </Panel>
                      ))
                    : null}
                </>
              ) : null}

              {viewState === 'fromTemplate' ? (
                <div>
                  Template form fields for {selectedTemplate.sandbox.title}
                </div>
              ) : null}

              {viewState === 'fork' ? <div>Repo fork form fields</div> : null}
            </ModalContent>
          </ModalBody>
        </ModalLayout>
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
