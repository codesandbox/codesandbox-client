import React from 'react';
import { Container, Title, Description } from './elements';

export default class Configuration extends React.PureComponent {
  render() {
    const { config, width, height } = this.props;

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
      </Container>
    );
  }
}
