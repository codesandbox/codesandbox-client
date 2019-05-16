import React, { Fragment, useState } from 'react';

import track from '@codesandbox/common/lib/utils/analytics';
import Template from '@codesandbox/common/lib/components/Template';

import GithubLogo from 'react-icons/lib/go/mark-github';
import TerminalIcon from 'react-icons/lib/go/terminal';
import UploadIcon from 'react-icons/lib/go/cloud-upload';

import {
  Container,
  InnerContainer,
  Templates,
  ImportChoice,
  ImportChoices,
  Tab,
  Button,
  TabContainer,
  Title,
} from './elements';
import availableTemplates from './availableTemplates';

export default ({ forking = false, closing = false, createSandbox }) => {
  const [selectedTab, setSelectedTab] = useState(0);

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
        {availableTemplates.map(({ name }, i) => (
          <Button
            key={name}
            selected={selectedTab === i}
            onClick={() => setSelectedTab(i)}
          >
            {name}
          </Button>
        ))}
      </TabContainer>

      <InnerContainer forking={forking} closing={closing}>
        {availableTemplates.map((tab, i) => (
          <Tab key={tab.name} visible={selectedTab === i}>
            <Templates>
              {tab.templates &&
                tab.templates.map(template => (
                  <Template
                    key={template.name}
                    template={template}
                    selectTemplate={selectTemplate}
                  />
                ))}
              {tab.types &&
                tab.types.map(type => (
                  <Fragment key={type.name}>
                    <Title>{type.name}</Title>
                    {type.templates.map(template => (
                      <Template
                        key={template.name}
                        template={template}
                        selectTemplate={selectTemplate}
                      />
                    ))}
                  </Fragment>
                ))}
            </Templates>
          </Tab>
        ))}
        <ImportChoices>
          <ImportChoice href="/s/github" target="_blank">
            <GithubLogo /> Import from GitHub
          </ImportChoice>
          <ImportChoice href="/docs/importing#export-with-cli" target="_blank">
            <TerminalIcon /> Export with CLI
          </ImportChoice>
          <ImportChoice href="/docs/importing#define-api" target="_blank">
            <UploadIcon /> Create with API
          </ImportChoice>
        </ImportChoices>
      </InnerContainer>
    </Container>
  );
};
