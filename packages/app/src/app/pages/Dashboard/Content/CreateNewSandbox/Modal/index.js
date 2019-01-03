import React, { Fragment } from 'react';
import * as templates from '@codesandbox/common/lib/templates';
import { sortBy } from 'lodash-es';

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
} from './elements';
import Template from './Template';

const usedTemplates = sortBy(
  Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .filter(t => t.showOnHomePage),
  'niceName'
);

export default class Modal extends React.PureComponent {
  state = {
    selectedTab: 0,
  };

  setTab = tab => this.setState({ selectedTab: tab });

  selectTemplate = template => {
    this.props.createSandbox(template);
  };

  render() {
    const { forking = false, closing = false } = this.props;

    const popularTemplates = usedTemplates.filter(t => t.popular);
    const clientTemplates = usedTemplates.filter(
      t => !t.isServer && !t.popular
    );
    const serverTemplates = usedTemplates.filter(t => t.isServer && !t.popular);
    const typescriptTemplates = [
      {
        ...templates.react,
        variantName: templates.react.niceName,
        niceName: 'React + TS',
        shortid: 'react-ts',
      },
      {
        ...templates.parcel,
        variantName: templates.parcel.niceName,
        niceName: 'Vanilla + TS',
        shortid: 'vanilla-ts',
      },
    ];
    const { selectedTab } = this.state;
    return (
      <Fragment>
        <TabContainer>
          <Button selected={selectedTab === 0} onClick={() => this.setTab(0)}>
            Popular Templates
          </Button>
          <Button selected={selectedTab === 1} onClick={() => this.setTab(1)}>
            Client Templates
          </Button>
          <Button selected={selectedTab === 2} onClick={() => this.setTab(2)}>
            Server Templates
          </Button>
          <Button selected={selectedTab === 3} onClick={() => this.setTab(3)}>
            Presets
          </Button>
        </TabContainer>
        <Container
          closing={closing}
          forking={forking}
          onMouseDown={e => e.preventDefault()}
        >
          <InnerContainer forking={forking} closing={closing}>
            <Tab visible={selectedTab === 0}>
              <Templates>
                {popularTemplates.map(t => (
                  <Template
                    key={t.name}
                    template={t}
                    selectTemplate={this.selectTemplate}
                  />
                ))}
              </Templates>
            </Tab>
            <Tab visible={selectedTab === 1}>
              <Templates>
                {clientTemplates.map(t => (
                  <Template
                    key={t.name}
                    template={t}
                    selectTemplate={this.selectTemplate}
                  />
                ))}
              </Templates>
            </Tab>
            <Tab visible={selectedTab === 2}>
              <Templates>
                {serverTemplates.map(t => (
                  <Template
                    key={t.name}
                    template={t}
                    selectTemplate={this.selectTemplate}
                  />
                ))}
              </Templates>
            </Tab>
            <Tab visible={selectedTab === 3}>
              <Templates>
                {typescriptTemplates.map(t => (
                  <Template
                    small
                    key={t.name}
                    template={t}
                    selectTemplate={this.selectTemplate}
                    subtitle={`Using ${t.variantName} template`}
                  />
                ))}
              </Templates>
            </Tab>
            <ImportChoices>
              <ImportChoice
                href="/docs/importing#import-from-github"
                target="_blank"
              >
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
      </Fragment>
    );
  }
}
