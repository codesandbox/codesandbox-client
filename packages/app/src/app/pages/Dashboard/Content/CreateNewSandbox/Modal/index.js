import React, { useState } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import Template from '@codesandbox/common/lib/components/Template';
import { useStore } from 'app/store';
import ImportTab from './ImportTab';
import MyTemplates from './Components/MyTemplates';
import MyTemplatesTab from './Components/MyTemplatesTab';
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

export default ({ forking = false, closing = false, createSandbox }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useStore();

  const selectTemplate = template => {
    track('New Sandbox Modal - Select Template', { template });
    createSandbox(template);
  };

  return (
    <Container
      closing={closing}
      forking={forking}
      onMouseDown={e => e.preventDefault()}
    >
      <TabContainer forking={forking} closing={closing}>
        <Button selected={selectedTab === 0} onClick={() => setSelectedTab(0)}>
          Overview
        </Button>
        {user && (
          <Button
            selected={selectedTab === 1}
            onClick={() => setSelectedTab(1)}
          >
            My Templates
          </Button>
        )}
        <Button selected={selectedTab === 2} onClick={() => setSelectedTab(2)}>
          Client Templates
        </Button>
        <Button selected={selectedTab === 3} onClick={() => setSelectedTab(3)}>
          Container Templates
        </Button>
        <Button selected={selectedTab === 4} onClick={() => setSelectedTab(4)}>
          Import
        </Button>
      </TabContainer>

      <InnerContainer forking={forking} closing={closing}>
        <Tab visible={selectedTab === 0}>
          {user && <MyTemplates />}
          <Title>Popular Templates</Title>
          <Templates>
            {popular.map(type =>
              type.templates.map(template => (
                <Template
                  key={template.name}
                  template={template}
                  selectTemplate={selectTemplate}
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
                template={template}
                selectTemplate={selectTemplate}
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
              />
            ))}
          </Templates>
        </Tab>
        <Tab visible={selectedTab === 4}>
          <ImportTab />
        </Tab>
      </InnerContainer>
    </Container>
  );
};
