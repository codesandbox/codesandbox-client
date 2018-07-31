import React from 'react';
import * as templates from 'common/templates';
import { chunk, sortBy } from 'lodash-es';

import { Container, InnerContainer, Templates, Title } from './elements';
import Template from './Template';

const usedTemplates = sortBy(
  Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .filter(t => t.showOnHomePage),
  'niceName'
);

const TEMPLATE_BASE_WIDTH = 215;
const MAIN_TEMPLATE_BASE_WIDTH = 215;

export default class Modal extends React.PureComponent {
  selectTemplate = template => {
    this.props.createSandbox(template);
  };

  render() {
    const { width, forking, closing } = this.props;

    const paddedWidth = width;
    const mainTemplates = usedTemplates.filter(t => t.main);
    const otherTemplates = usedTemplates.filter(t => !t.main);

    const mainTemplatesPerRow = Math.max(
      1,
      paddedWidth / MAIN_TEMPLATE_BASE_WIDTH
    );
    const templatesPerRow = Math.max(1, paddedWidth / TEMPLATE_BASE_WIDTH);

    const mainRows = chunk(mainTemplates, mainTemplatesPerRow);
    const rows = chunk(otherTemplates, templatesPerRow);

    return (
      <Container
        closing={closing}
        forking={forking}
        onMouseDown={e => e.preventDefault()}
      >
        <InnerContainer forking={forking} closing={closing}>
          <Title>Choose your template</Title>
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
            <Templates key={i}>
              {ts.map(t => (
                <Template
                  width={Math.floor(paddedWidth / templatesPerRow - 16)}
                  key={t.name}
                  template={t}
                  selectTemplate={this.selectTemplate}
                />
              ))}
            </Templates>
          ))}
        </InnerContainer>
      </Container>
    );
  }
}
