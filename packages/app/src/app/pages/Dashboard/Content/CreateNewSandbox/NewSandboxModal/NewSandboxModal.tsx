import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';
import { useTabState, Tab as ReakitTab, TabList, TabPanel } from 'reakit/Tab';
import track from '@codesandbox/common/lib/utils/analytics';
import Template from '@codesandbox/common/lib/components/Template';
import { ImportTab } from './ImportTab';
import { MyTemplates } from './MyTemplates';
import { MyTemplatesTab } from './MyTemplatesTab';
import {
  Container,
  InnerContainer,
  Templates,
  Tab,
  Button,
  TabContainer,
  Title,
} from './elements';
import { popular, client, container, presets } from './availableTemplates';

interface INewSandboxModalProps {
  forking: boolean;
  closing: boolean;
  createSandbox: (params: { shortid: string }) => void;
  store: any;
  signals: any;
}

interface ITab {
  name: string;
  tabIndex: string;
}

export const NewSandboxModal = inject('store', 'signals')(
  hooksObserver(
    ({
      forking = false,
      closing = false,
      createSandbox,
      store: { user },
    }: INewSandboxModalProps) => {
      const tabState = useTabState({ selectedId: '0' });

      const tabs: ITab[] = [
        'Overview',
        user && 'My Templates',
        'Client Templates',
        'Container Templates',
        'Import',
      ]
        .map((buttonName, index) => ({
          name: buttonName,
          tabIndex: String(index),
        }))
        .filter(({ name }) => Boolean(name));

      React.useEffect(() => {
        const selectedTab = tabs[tabState.currentId];

        if (selectedTab) {
          track('New Sandbox Modal - Open Tab', { tabName: selectedTab.name });
        }
      }, [tabs, tabState.currentId]);

      const selectTemplate = template => {
        track('New Sandbox Modal - Select Template', { template });
        createSandbox(template);
      };

      return (
        <Container closing={closing} forking={forking}>
          <TabList
            as={TabContainer}
            {...tabState}
            aria-label="new sandbox"
            closing={closing}
            forking={forking}
          >
            {tabs.map(tab => (
              <ReakitTab
                as={Button}
                {...tabState}
                key={tab.name}
                stopId={tab.tabIndex}
                selected={tabState.currentId === tab.tabIndex}
              >
                {tab.name}
              </ReakitTab>
            ))}
          </TabList>

          <InnerContainer forking={forking} closing={closing}>
            <TabPanel {...tabState} as={Tab} stopId="0">
              {user && <MyTemplates selectTemplate={selectTemplate} />}
              <Title>Popular Templates</Title>
              <Templates>
                {popular.map(type =>
                  type.templates.map(template => (
                    <Template
                      key={template.name}
                      template={template}
                      selectTemplate={selectTemplate}
                      small={false}
                    />
                  ))
                )}
              </Templates>
            </TabPanel>
            {user && (
              <TabPanel {...tabState} as={Tab} stopId="1">
                <MyTemplatesTab selectTemplate={selectTemplate} />
              </TabPanel>
            )}
            <TabPanel {...tabState} as={Tab} stopId="2">
              <Title>Client Templates</Title>
              <Templates>
                {client.map(template => (
                  <Template
                    key={template.name}
                    template={template}
                    selectTemplate={selectTemplate}
                    small={false}
                  />
                ))}
              </Templates>
              <Title
                css={`
                  margin-top: 1rem;
                `}
              >
                Presets
              </Title>
              <Templates>
                {presets.map(template => (
                  <Template
                    key={template.name}
                    // @ts-ignore
                    template={template}
                    selectTemplate={selectTemplate}
                    small={false}
                  />
                ))}
              </Templates>
            </TabPanel>
            <TabPanel {...tabState} as={Tab} stopId="3">
              <Title>Container Templates</Title>
              <Templates>
                {container.map(template => (
                  <Template
                    key={template.name}
                    template={template}
                    selectTemplate={selectTemplate}
                    small={false}
                  />
                ))}
              </Templates>
            </TabPanel>
            <TabPanel {...tabState} as={Tab} stopId="4">
              <ImportTab username={user ? user.username : undefined} />
            </TabPanel>
          </InnerContainer>
        </Container>
      );
    }
  )
);
