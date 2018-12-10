import React from 'react';
import styled, { css } from 'styled-components';
import { TimelineMax, Power2 } from 'gsap';

import Centered from 'common/components/flex/Centered';
import MaxWidth from 'common/components/flex/MaxWidth';

import theme from 'common/theme';

import GithubIcon from 'react-icons/lib/go/mark-github';
import BuildIcon from 'react-icons/lib/go/tools';
import CommitIcon from 'react-icons/lib/go/git-commit';
import RocketIcon from 'react-icons/lib/go/rocket';

import getScrollPos from '../../../utils/scroll';
import media from '../../../utils/media';

import Cube from './Cube';
import Step from './Step';

const Heading = styled.h2`
  text-align: center;
  font-weight: 300;
  font-size: 2.5rem;
  margin-top: 6rem;
  margin-bottom: 1rem;

  text-transform: uppercase;

  ${media.phone`
    margin-top: 3rem;
    margin-bottom: 0;
  `};

  color: ${({ theme }) => theme.secondary};
  text-shadow: 0 0 50px ${({ theme }) => theme.secondary.clearer(0.6)};
`;

const SubHeading = styled.p`
  font-size: 1.25rem;
  text-align: center;

  font-weight: 200;
  line-height: 1.4;
  max-width: 40rem;

  color: rgba(255, 255, 255, 0.8);
`;

const Steps = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;

  ${media.tablet`
    flex: 1;
  `};
`;

const Flow = styled.div`
  display: flex;
  margin-top: 8rem;
`;

const OffsettedCube = styled.div`
  margin-top: -80px;
`;

const CubeSteps = styled.div`
  position: relative;
  display: flex;
  flex: 1;

  margin-left: 4rem;
  align-items: center;
  justify-content: center;

  ${media.tablet`
    flex: 2;
  `};

  ${media.phone`
    display: none;
  `};
`;

const ImportContainer = styled.div`
  position: absolute;
  width: 100%;
  background-color: ${({ theme }) => theme.background5};
  padding-top: 1rem;

  top: 0;
`;

const DeployContainer = styled.div`
  position: absolute;
  width: 100%;
  background-color: ${({ theme }) => theme.background5};

  overflow: hidden;

  display: flex;
  justify-content: flex-start;

  bottom: 0;
  height: calc(250px - 1rem); /* The margin is the 1rem */
`;

const AddressBar = styled.a`
  display: block;
  position: relative;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1.125rem;
  color: white;
  font-weight: 200;
  margin-bottom: 1rem;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }

  text-decoration: none;

  border: 1px solid rgba(0, 0, 0, 0.2);

  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
`;

const AddedUrl = styled.span`
  color: ${({ theme }) => theme.secondary};
  text-align: right;
  overflow: hidden;
`;

const Progress = styled.div`
  position: absolute;
  width: 0;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  border-radius: 4px;

  background-color: ${props => props.theme.secondary};
  box-shadow: 0 0 100px ${props => props.theme.secondary.clearer(0.3)};
`;

export default class CycleFeatures extends React.PureComponent {
  state = {
    selectedStep: 0,
    manuallySelected: false,
  };

  verticalSteps = {};

  setStepForScroll(scroll: number, step: number) {
    if (
      scroll + window.innerHeight / 2 > this.verticalSteps[step] &&
      step > this.state.selectedStep
    ) {
      this.selectStep(step, false);
    }
  }

  updateStepBasedOnScroll = () => {
    const scrollTop = getScrollPos().y;

    for (let i = 0; i < 4; i++) {
      this.setStepForScroll(scrollTop, i);
    }
  };

  selectStep = (step, manual = true) => {
    if (!manual && this.state.manuallySelected) {
      // User selected manually, we don't want to override manual behaviour
      // with scroll behaviour
      return;
    }

    if (this.state.selectedStep === 3) {
      this.animation.progress(0);
    }

    this.setState({ selectedStep: step, manuallySelected: manual });

    this.animation.tweenTo('step' + (step + 1));
  };

  setY = (step: number, y: number) => {
    this.verticalSteps[step] = this.verticalSteps[step] || y;
  };

  componentDidMount() {
    window.addEventListener('scroll', this.updateStepBasedOnScroll);
    const cubeY = this.cube.getBoundingClientRect().top;

    this.animation = new TimelineMax({ paused: true })
      .set('#addition-cube', {
        y: 0,
        x: 0,
        zIndex: 2,
        transformOrigin: '50% 50%',
        position: 'absolute',
      })
      .set('#main-cube-side', {
        backgroundColor: theme.secondary.clearer(0.2)(),
        zIndex: 1,
        boxShadow: `0px 0px 150px ${theme.secondary()}`,
      })
      .set('#progress-text', {
        autoAlpha: 0,
        display: 'none',
      })
      .set('#deploy-text', {
        autoAlpha: 0,
        display: 'none',
      })
      .set('#deploy-container-address', {
        height: 46,
        width: '100%',
      })
      .to('#deploy-container', 0.3, {
        width: 0,
      })
      .fromTo(
        this.cube,
        0.8,
        {
          scale: 0,
          x: 0,
          position: 'relative',
          rotation: 0,
          y: this.verticalSteps[0] - cubeY - 40,
        },
        {
          y: this.verticalSteps[0] - cubeY - 40,
          ease: Power2.easeInOut,
        }
      )
      .to(
        this.cube,
        1.2,
        {
          y: this.verticalSteps[1] - cubeY - 40,
          scale: 1,
          rotation: 720,
          ease: Power2.easeInOut,
        },
        'step1'
      )
      .set('#main-cube-side', { backgroundColor: theme.primary.clearer(0.2)() })
      .to('#addition-cube', 0.6, {
        ease: Power2.easeOut,
        y: -45,
      })
      .to(
        '#main-cube',
        0.6,
        {
          ease: Power2.easeOut,
          y: 45,
        },
        '-=0.6'
      )
      .to(
        '#main-cube-side',
        0.2,
        {
          boxShadow: `0px 0px 150px ${theme.primary()}`,
        },
        '-=0.6'
      )
      .to(
        this.cube,
        1.2,
        {
          y: this.verticalSteps[2] - cubeY - 40,

          ease: Power2.easeInOut,
        },
        'step2'
      )
      .to(
        '#main-cube',
        0.6,
        {
          y: '+=30',
          ease: Power2.easeIn,
        },
        '-=1.2'
      )
      .to(
        '#main-cube',
        0.6,
        {
          y: 40,
          ease: Power2.easeOut,
        },
        '-=0.6'
      )
      .to(
        '#addition-cube',
        0.2,
        {
          y: -40,
        },
        '-=0.2'
      )
      .to('#main-cube-side', 0.7, {
        backgroundColor: theme.secondary.clearer(0.2)(),
        boxShadow: `0px 0px 150px ${theme.secondary()}`,
        ease: Power2.easeInOut,
      })
      .to(
        '#deploy-container',
        0.6,
        {
          width: '100%',
          ease: Power2.easeInOut,
        },
        'step3'
      )
      .to(this.cube, 1.2, {
        y: this.verticalSteps[3] - cubeY + 40,
        scale: 0.5,
        ease: Power2.easeInOut,
      })
      .to('#progress-text', 0.3, {
        autoAlpha: 1,
        display: 'inline-block',
      })
      .to('#progress', 2, { width: '100%', ease: Power2.easeIn })
      .set('#progress-text', {
        autoAlpha: 0,
        display: 'none',
      })
      .set('#deploy-text', {
        autoAlpha: 1,
        display: 'inline-block',
      })
      .to('#progress', 0.3, { height: 0, ease: Power2.easeInOut })
      .to(this.cube, 0, {}, 'step4');

    this.animation.tweenTo('step1');
  }

  render() {
    const { selectedStep } = this.state;
    return (
      <MaxWidth width={1280}>
        <Centered horizontal>
          <Heading>Be Productive, Anywhere</Heading>
          <SubHeading>
            We aim to give you the tools to build a full blown web application.
            You can easily import projects from GitHub, make commits, and
            finally deploy. We support the whole cycle.
          </SubHeading>
          {/*
          <StepDescription>
            You can import projects on GitHub by going to
            codesandbox.io/s/github.
          </StepDescription> */}
        </Centered>

        <Flow>
          <Steps>
            <Step
              selected={selectedStep >= 0}
              i={0}
              selectedStep={selectedStep}
              selectStep={this.selectStep}
              getY={this.setY}
              Icon={GithubIcon}
              title="Import"
              description="Paste your GitHub URL. You get a sandbox that stays up to date with the latest changes automatically."
            />
            <Step
              selected={selectedStep >= 1}
              i={1}
              selectedStep={selectedStep}
              selectStep={this.selectStep}
              getY={this.setY}
              Icon={BuildIcon}
              title="Build"
              description="Fork the sandbox and start building that long awaited feature!"
            />
            <Step
              selected={selectedStep >= 2}
              i={2}
              selectedStep={selectedStep}
              selectStep={this.selectStep}
              getY={this.setY}
              Icon={CommitIcon}
              title="Commit"
              description="Commit your changes or open a pull request with a user friendly UI."
            />
            <Step
              selected={selectedStep >= 3}
              i={3}
              selectedStep={selectedStep}
              selectStep={this.selectStep}
              getY={this.setY}
              Icon={RocketIcon}
              title="Deploy"
              description="Deploy a production version of your sandbox using ZEIT Now."
            />
          </Steps>

          <CubeSteps>
            <OffsettedCube
              ref={el => {
                this.cube = el;
              }}
            >
              <Cube
                id="addition-cube"
                noAnimation
                size={90}
                offset={40}
                color={theme.secondary}
                style={{ position: 'absolute', top: 0 }}
              />
              <Cube
                id="main-cube"
                noAnimation
                size={90}
                offset={40}
                color={theme.primary}
                style={{ position: 'absolute', top: 0 }}
              />
            </OffsettedCube>
            <ImportContainer>
              <AddressBar
                href="https://github.com/reactjs/redux/tree/master/examples/todos"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>github.com/</span>
                <AddedUrl id="added-url">
                  reactjs/redux/tree/master/examples/todos
                </AddedUrl>
              </AddressBar>
              <AddressBar
                href="/s/github/reactjs/redux/tree/master/examples/todos"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>codesandbox.io/s/github/</span>
                <AddedUrl id="added-url">
                  reactjs/redux/tree/master/examples/todos
                </AddedUrl>
              </AddressBar>
            </ImportContainer>

            <DeployContainer id="deploy-container">
              <AddressBar
                id="deploy-container-address"
                href="https://csb-921ywn9qrw-emlplxhibt.now.sh/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span id="progress-text" style={{ textAlign: 'center' }}>
                  Deploying...
                </span>
                <span style={{ color: theme.secondary() }} id="deploy-text">
                  https://csb-921ywn9qrw-emlplxhibt.now.sh/
                </span>
                <Progress id="progress" />
              </AddressBar>
            </DeployContainer>
          </CubeSteps>
        </Flow>
      </MaxWidth>
    );
  }
}
