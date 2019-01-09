import React from 'react';
import styled from 'styled-components';
import Media from 'react-media';

import Fullscreen from 'common/components/flex/Fullscreen';
import Centered from 'common/components/flex/Centered';
import Relative from 'common/components/Relative';

import {
  angular,
  vue,
  react,
  preact,
  svelte,
  parcel,
  cxjs,
  dojo,
} from 'common/templates';

import Background from './Background';
import HomeTitle from './Title';
import Cubes from './Cubes';
import Frameworks from '../Frameworks';

import getScrollPos from '../../../utils/scroll';

import media from '../../../utils/media';

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
  margin-top: 6rem;
  margin-bottom: 8rem;

  height: initial;
`};
`;

const Message = styled.h2`
  text-align: center;
  font-weight: 200;

  color: white;
  font-size: 2.5rem;
  max-width: 1000px;
  line-height: 1.2;
  margin-bottom: 3rem;
  margin-top: 3rem;
  margin-right: 2rem;
  margin-left: 2rem;

  ${media.phone`
  font-size: 1.25rem;
`};
`;

const TEMPLATES = [parcel, react, vue, angular, preact, svelte, cxjs, dojo];

export default class Animation extends React.PureComponent {
  state = {
    templates: TEMPLATES.filter(tem => tem.showOnHomePage && tem.showCube),
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
        if (!window.scrolling && getScrollPos().y < window.innerHeight) {
          this.setState({
            templateIndex:
              (this.state.templateIndex + 1) % this.state.templates.length,
          });
        }

        this.startTimer();
      }
    }, 6000);
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
      <Relative>
        <Fullscreen>
          <Background
            templateIndex={this.state.templateIndex}
            template={template}
            setCanvas={this.setCanvas}
          />
          <Container horizontal>
            <HomeTitle template={template} />
            <Media query="(min-width: 1280px)">
              <Cubes
                canvas={this.state.canvas}
                templates={this.state.templates}
                template={template}
                setTemplate={this.selectTemplate}
              />
            </Media>
          </Container>
        </Fullscreen>
        <Centered horizontal>
          <Message>
            CodeSandbox is an online editor that helps you create web
            applications, from prototype to deployment.
          </Message>
        </Centered>
        <Frameworks templates={TEMPLATES.filter(tem => tem.showOnHomePage)} />
      </Relative>
    );
  }
}
