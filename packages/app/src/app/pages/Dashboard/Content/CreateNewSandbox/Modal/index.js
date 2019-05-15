import React, { Fragment } from 'react';

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

export default class Modal extends React.PureComponent {
  state = {
    selectedTab: 0,
  };

  selectTemplate = template => {
    track('New Sandbox Modal - Select Template', { template });
    this.props.createSandbox(template);
  };

  render() {
    const { forking = false, closing = false } = this.props;

    const { selectedTab } = this.state;

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
              onClick={() => this.setState({ selectedTab: i })}
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
                      selectTemplate={this.selectTemplate}
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
                          selectTemplate={this.selectTemplate}
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
            <ImportChoice
              href="/docs/importing#export-with-cli"
              target="_blank"
            >
              <TerminalIcon /> Export with CLI
            </ImportChoice>
            <ImportChoice href="/docs/importing#define-api" target="_blank">
              <UploadIcon /> Create with API
            </ImportChoice>
          </ImportChoices>
        </InnerContainer>
      </Container>
    );
  }
}
