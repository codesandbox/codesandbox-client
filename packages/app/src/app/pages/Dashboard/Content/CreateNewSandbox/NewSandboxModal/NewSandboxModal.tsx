import track from '@codesandbox/common/lib/utils/analytics';
import Template from '@codesandbox/common/lib/components/Template';
import React, { FunctionComponent, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { popular, client, container, presets } from './availableTemplates';
import {
  Container,
  InnerContainer,
  Templates,
  Tab,
  Button,
  TabContainer,
  Title,
} from './elements';
import { ImportTab } from './ImportTab';
import { MyTemplates } from './MyTemplates';
import { MyTemplatesTab } from './MyTemplatesTab';

type Props = {
  closing: boolean;
  createSandbox: (params: { shortid: string }) => void;
  forking: boolean;
};

type ITab = {
  name: string;
  tabIndex: number;
};

export const NewSandboxModal: FunctionComponent<Props> = ({
  forking = false,
  closing = false,
  createSandbox,
}) => {
  const {
    state: { user },
  } = useOvermind();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs: ITab[] = [
    'Overview',
    user && 'My Templates',
    'Client Templates',
    'Container Templates',
    'Import',
  ]
    .map((buttonName, index) => ({
      name: buttonName,
      tabIndex: index,
    }))
    .filter(({ name }) => Boolean(name));

  const selectTab = (tab: ITab) => {
    setSelectedTab(tab.tabIndex);

    track('New Sandbox Modal - Open Tab', { tabName: tab.name });
  };

  const selectTemplate = template => {
    track('New Sandbox Modal - Select Template', { template });
    createSandbox(template);
  };

  return (
    <Container closing={closing} forking={forking}>
      <TabContainer forking={forking} closing={closing}>
        {tabs.map(tab => (
          <Button
            key={tab.name}
            onClick={() => {
              selectTab(tab);
            }}
            selected={selectedTab === tab.tabIndex}
          >
            {tab.name}
          </Button>
        ))}
      </TabContainer>

      <InnerContainer forking={forking} closing={closing}>
        <Tab visible={selectedTab === 0}>
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
        </Tab>

        {user && (
          <Tab visible={selectedTab === 1}>
            <MyTemplatesTab selectTemplate={selectTemplate} />
          </Tab>
        )}

        <Tab visible={selectedTab === 2}>
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

          {/* TODO: Find a fix for css props
            // @ts-ignore */}
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
        </Tab>

        <Tab visible={selectedTab === 3}>
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
        </Tab>

        <Tab visible={selectedTab === 4}>
          <ImportTab username={user ? user.username : undefined} />
        </Tab>
      </InnerContainer>
    </Container>
  );
};
