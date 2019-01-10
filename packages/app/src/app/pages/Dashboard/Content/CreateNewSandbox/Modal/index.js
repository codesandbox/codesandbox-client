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

const availableTemplates = [
  {
    name: 'Popular Templates',
    templates: usedTemplates.filter(t => t.popular),
  },
  {
    name: 'Client Templates',
    templates: usedTemplates.filter(t => !t.isServer && !t.popular),
  },
  {
    name: 'Server Templates',
    templates: usedTemplates.filter(t => t.isServer && !t.popular),
  },
  {
    name: 'Presets',
    templates: [
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
    ],
  },
];

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

    const { selectedTab } = this.state;
    return (
      <Fragment>
        <TabContainer>
          {availableTemplates.map((t, i) => (
            <Button key={i} selected={selectedTab === i} onClick={() => this.setTab(i)}>
              {t.name}
            </Button>
          ))}
        </TabContainer>
        <Container
          closing={closing}
          forking={forking}
          onMouseDown={e => e.preventDefault()}
        >
          <InnerContainer forking={forking} closing={closing}>
            {availableTemplates.map((tab, i) => (
              <Tab visible={selectedTab === i}>
                <Templates>
                  {tab.templates.map(t => (
                    <Template
                      key={t.name}
                      template={t}
                      selectTemplate={this.selectTemplate}
                    />
                  ))}
                </Templates>
              </Tab>
            ))}
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
