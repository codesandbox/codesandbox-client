import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import track from '@codesandbox/common/lib/utils/analytics';
import Template from '@codesandbox/common/lib/components/Template';
import Loading from 'app/components/Loading';
import ImportTab from './ImportTab';
import {
  Container,
  InnerContainer,
  Templates,
  Tab,
  Button,
  TabContainer,
  Title,
} from './elements';

import { popular, client, container } from './availableTemplates';
import { LIST_TEMPLATES } from '../GraphQL/list';

export default ({ forking = false, closing = false, createSandbox }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const {
    loading,
    data: { me },
  } = useQuery(LIST_TEMPLATES);

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
          Create Sandbox
        </Button>
        <Button selected={selectedTab === 1} onClick={() => setSelectedTab(1)}>
          My Templates
        </Button>
        <Button selected={selectedTab === 2} onClick={() => setSelectedTab(2)}>
          Import
        </Button>
      </TabContainer>

      <InnerContainer forking={forking} closing={closing}>
        <Tab visible={selectedTab === 0}>
          <Templates>
            {popular.map(type => (
              <>
                <Title>{type.name}</Title>
                {type.templates.map(template => (
                  <Template
                    key={template.name}
                    template={template}
                    selectTemplate={selectTemplate}
                  />
                ))}
              </>
            ))}
          </Templates>
        </Tab>
        <Tab visible={selectedTab === 1}>
          {loading ? (
            <Loading />
          ) : (
            <Templates>
              {me.templates.map(template => (
                <Template
                  key={template.id}
                  template={template}
                  selectTemplate={selectTemplate}
                />
              ))}
            </Templates>
          )}
        </Tab>
        <Tab visible={selectedTab === 2}>
          <ImportTab />
        </Tab>
      </InnerContainer>
    </Container>
  );
};
