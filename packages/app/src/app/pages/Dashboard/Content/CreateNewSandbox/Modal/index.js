import React from 'react';
import * as templates from 'common/templates';
import { chunk, sortBy } from 'lodash-es';

import GithubLogo from 'react-icons/lib/go/mark-github';
import TerminalIcon from 'react-icons/lib/go/terminal';
import UploadIcon from 'react-icons/lib/go/cloud-upload';

import {
  Container,
  InnerContainer,
  Templates,
  Title,
  ImportChoice,
  ImportChoices,
} from './elements';
import Template from './Template';

const usedTemplates = sortBy(
  Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .filter(t => t.showOnHomePage),
  'niceName'
);

const TEMPLATE_BASE_WIDTH = 150;
const MAIN_TEMPLATE_BASE_WIDTH = 190;
const SERVER_TEMPLATE_BASE_WIDTH = 150; // 150

export default class Modal extends React.PureComponent {
  selectTemplate = template => {
    this.props.createSandbox(template);
  };

  render() {
    const { width, forking = false, closing = false } = this.props;

    const paddedWidth = width;
    const mainTemplates = usedTemplates.filter(t => t.main && !t.isServer);
    const otherTemplates = usedTemplates.filter(t => !t.main && !t.isServer);
    const serverTemplates = usedTemplates.filter(t => t.isServer);

    const mainTemplatesPerRow = Math.max(
      1,
      paddedWidth / MAIN_TEMPLATE_BASE_WIDTH
    );
    const templatesPerRow = Math.max(1, paddedWidth / TEMPLATE_BASE_WIDTH);
    const serverTemplatesPerRow = Math.max(
      1,
      paddedWidth / SERVER_TEMPLATE_BASE_WIDTH
    );

    const mainRows = chunk(mainTemplates, mainTemplatesPerRow);
    const rows = chunk(otherTemplates, templatesPerRow);
    const serverRows = chunk(serverTemplates, serverTemplatesPerRow);

    return (
      <Container
        closing={closing}
        forking={forking}
        onMouseDown={e => e.preventDefault()}
      >
        <InnerContainer forking={forking} closing={closing}>
          <Title>Client Templates</Title>
          {mainRows.map((ts, i) => (
            // eslint-disable-next-line
            <Templates key={i}>
              {ts.map(t => (
                <Template
                  width={Math.floor(paddedWidth / mainTemplatesPerRow - 16)}
                  key={t.name}
                  template={t}
                  selectTemplate={this.selectTemplate}
                />
              ))}
            </Templates>
          ))}

          {rows.map((ts, i) => (
            // eslint-disable-next-line
            <Templates style={{ fontSize: '.8rem' }} key={i}>
              {ts.map(t => (
                <Template
                  small
                  width={Math.floor(paddedWidth / templatesPerRow - 16)}
                  key={t.name}
                  template={t}
                  selectTemplate={this.selectTemplate}
                />
              ))}
            </Templates>
          ))}

          <Title>Server Templates</Title>
          {serverRows.map((ts, i) => (
            // eslint-disable-next-line
            <Templates style={{ fontSize: '.9rem' }} key={i}>
              {ts.map(t => (
                <Template
                  width={Math.floor(paddedWidth / serverTemplatesPerRow - 16)}
                  key={t.name}
                  template={t}
                  selectTemplate={this.selectTemplate}
                />
              ))}
            </Templates>
          ))}

          <ImportChoices style={{ marginTop: '1.5rem' }}>
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
    );
  }
}
