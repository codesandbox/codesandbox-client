import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import Template from '@codesandbox/common/lib/components/Template';
import { useStore } from 'app/store';
import { ImportTab } from './ImportTab';
import { MyTemplates } from './MyTemplates';
import { MyTemplatesTab } from './MyTemplatesTab';
import { MyFavoriteTemplatesTab } from './MyFavoriteTemplatesTab';
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
}

export const NewSandboxModal = observer<INewSandboxModalProps>(
  ({ forking = false, closing = false, createSandbox }) => {
    const { user } = useStore();
    const [selectedTab, setSelectedTab] = useState(0);

    const selectTemplate = template => {
      track('New Sandbox Modal - Select Template', { template });
      createSandbox(template);
    };

    return (
      <Container closing={closing} forking={forking}>
        <TabContainer forking={forking} closing={closing}>
          {[
            'Overview',
            user && 'My Templates',
            user && 'Favorites',
            'Client',
            'Container',
            'Import',
          ]
            .map((buttonName, index) => ({
              name: buttonName,
              tabIndex: index,
            }))
            .filter(({ name }) => Boolean(name))
            .map(({ name, tabIndex }) => (
              <Button
                key={name}
                onClick={() => setSelectedTab(tabIndex)}
                selected={selectedTab === tabIndex}
              >
                {name}
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

          {user && (
            <Tab visible={selectedTab === 2}>
              <MyFavoriteTemplatesTab selectTemplate={selectTemplate} />
            </Tab>
          )}
          <Tab visible={selectedTab === 3}>
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
          <Tab visible={selectedTab === 4}>
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
          <Tab visible={selectedTab === 5}>
            <ImportTab username={user ? user.username : undefined} />
          </Tab>
        </InnerContainer>
      </Container>
    );
  }
);
