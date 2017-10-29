import React from 'react';
import styled from 'styled-components';
import Link from 'gatsby-link';

import Logo from 'common/components/Logo';
import Fullscreen from 'app/components/flex/Fullscreen';
import Centered from 'app/components/flex/Centered';
import theme from 'common/theme';
import Relative from 'app/components/Relative';

import * as templates from 'common/templates';

import HomeTitle from './home/Title';
import Cubes from './home/Cubes';
import Background from './home/Background';

const Container = styled(Centered)`
  width: 100%;
  height: 100vh;
  flex: auto;
  flex-direction: row;
  margin: 0 auto;
  max-width: 1280px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
`;

class IndexPage extends React.PureComponent {
  state = {
    templates: Object.keys(templates)
      .filter(k => k !== 'default' && k !== '__esModule')
      .map(tem => templates[tem]),
    templateIndex: 0,
  };

  componentDidMount() {
    this.timeout = setInterval(() => {
      this.setState({
        templateIndex:
          (this.state.templateIndex + 1) % this.state.templates.length,
      });
    }, 15000);
  }

  render() {
    const template = this.state.templates[this.state.templateIndex];
    return (
      <Relative>
        <Fullscreen>
          <Background
            templateIndex={this.state.templateIndex}
            template={template}
          />
          <Container horizontal>
            <HomeTitle template={template} />
            <Cubes template={template} />
          </Container>
        </Fullscreen>
      </Relative>
    );
  }
}

export default IndexPage;
