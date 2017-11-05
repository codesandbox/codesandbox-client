import React from 'react';
import styled from 'styled-components';

import Fullscreen from 'app/components/flex/Fullscreen';
import Centered from 'app/components/flex/Centered';
import Relative from 'app/components/Relative';

import * as templates from 'common/templates';

import HomeTitle from './home/Title';
import Cubes from './home/Cubes';
import Frameworks from './home/Frameworks';
import Background from './home/Background';
import EditorFeatures from './home/EditorFeatures';
import NPMFeature from './home/NPMFeature';
import CycleFeature from './home/CycleFeature';

import media from '../utils/media';

const Container = styled(Centered)`
  position: relative;
  width: 100%;
  height: 100vh;
  flex: auto;
  flex-direction: row;
  margin: 0 auto;
  max-width: 1280px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;

  ${media.tablet`
    display: block;
    flex-direction: column;
    margin-top: 2rem;
  `};
`;

const Message = styled.div`
  text-align: center;
  font-weight: 200;

  color: white;
  font-size: 2.5rem;
  max-width: 1000px;
  line-height: 1.2;
  margin-bottom: 4rem;

  margin-right: 2rem;
  margin-left: 2rem;

  ${media.phone`
    font-size: 1.25rem;
  `};
`;

class IndexPage extends React.PureComponent {
  state = {
    templates: Object.keys(templates)
      .filter(k => k !== 'default' && k !== '__esModule')
      .map(tem => templates[tem])
      .filter(tem => tem.Icon),
    templateIndex: 0,
    templateSelected: false,
    canvas: null,
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  startTimer = () => {
    this.timeout = setTimeout(() => {
      if (!this.state.templateSelected) {
        this.setState({
          templateIndex:
            (this.state.templateIndex + 1) % this.state.templates.length,
        });

        this.startTimer();
      }
    }, 5000);
  };

  setCanvas = canvas => {
    this.setState({ canvas });
  };

  selectTemplate = template => {
    this.setState({
      templateIndex: this.state.templates.indexOf(template),
      templateSelected: true,
    });
  };

  render() {
    const template = this.state.templates[this.state.templateIndex];
    return (
      <div style={{ marginBottom: 900 }} v>
        <Relative>
          <Fullscreen>
            <Background
              templateIndex={this.state.templateIndex}
              template={template}
              setCanvas={this.setCanvas}
            />
            <Container horizontal>
              <HomeTitle template={template} />
              <Cubes
                canvas={this.state.canvas}
                templates={this.state.templates}
                template={template}
                setTemplate={this.selectTemplate}
              />
            </Container>
          </Fullscreen>
          <Centered horizontal>
            <Message>
              CodeSandbox is an online editor that helps you create web
              applications, from prototype to deployment.
            </Message>
          </Centered>
          <Frameworks
            templates={this.state.templates}
            template={template}
            setTemplate={this.selectTemplate}
          />
        </Relative>
        <NPMFeature />
        <CycleFeature />
      </div>
    );
  }
}

export default IndexPage;
