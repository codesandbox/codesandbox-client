import React from 'react';
import { Container, Title, Description } from './elements';

export default class Configuration extends React.PureComponent {
  render() {
    const { config, currentModule, width, height } = this.props;

    const { ConfigWizard } = config.ui;

    return (
      <Container style={{ width, height }}>
        <Title>{config.title}</Title>
        <Description>
          {config.description}{' '}
          <a
            href={config.moreInfoUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            More info...
          </a>
        </Description>

        <ConfigWizard file={currentModule.code} />
      </Container>
    );
  }
}
