import React, { useRef, useEffect } from 'react';

import { applyParallax } from '../../utils/parallax';
import usePrefersReducedMotion from '../../utils/isReducedMOtion';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import CTA from '../../components/CTA';
import Button from '../../components/Button';
import { Description, H6 } from '../../components/Typography';

import {
  ContentBlock,
  Title,
  Subtitle,
  TitleWrapper,
  Wrapper,
  ContentBlockImage,
  FeaturedImage,
  Quote,
} from '../../components/LayoutComponents';

import ide from './images/hero-ide-home.png';
import npm from './images/npm.svg';
import fast from './images/fast.svg';
import components from './images/components.svg';
import share from './images/share.png';
import lock from './images/lock.svg';
import people from './images/people.svg';
import code from './images/code.svg';
import roy from './images/roy.png';
import bg from './images/bg.png';
import bg1 from './images/bg1.png';

export default () => {
  const parallaxRef = useRef(null);
  const parallaxRef1 = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      applyParallax(parallaxRef.current, {
        speed: 1.2,
        center: true,
      });
      applyParallax(parallaxRef1.current, {
        speed: 1.2,
        center: true,
      });
    }
  }, [prefersReducedMotion]);
  return (
    <Layout>
      <TitleAndMetaTags title="Personal Plan - CodeSandbox" />
      <Wrapper>
        <TitleWrapper>
          <Title>Experiment and learn without setup hassle.</Title>
        </TitleWrapper>
        <Description>
          Go straight to coding with instant sandboxes for rapid web
          development. Free for personal use.
        </Description>
        <div
          css={`
            margin: auto;
            display: flex;
            justify-content: center;
            margin: 2rem 0;
          `}
        >
          <Button href="https://codesandbox.io/s/" big>
            Get Started
          </Button>
        </div>
        <div>
          <div>
            <Subtitle as="h2">
              <H6>Prototyping</H6>
              Prototype Quickly
            </Subtitle>
          </div>
          <FeaturedImage bg={bg}>
            <img
              ref={parallaxRef}
              src={ide}
              alt="CodeSanddbox IDE"
              css={`
                width: 960px;

                ${props => props.theme.breakpoints.md} {
                  margin-top: 4rem;
                }
              `}
            />
          </FeaturedImage>
          <ContentBlock>
            <div>
              <h3> Code from anywhere.</h3>
              You just need a web browser.
            </div>

            <div>
              <h3>No setup.</h3>
              Go straight to coding with templates.
            </div>

            <div>
              <h3> VS Code built-in.</h3>
              The editor is full-featured, yet familiar.
            </div>
          </ContentBlock>

          <div>
            <Subtitle>
              <H6 center>Learning</H6>
              Experiment Easily
            </Subtitle>
          </div>

          <ContentBlock>
            <div>
              <ContentBlockImage bg="151515">
                <img src={fast} alt="Try things out" />
              </ContentBlockImage>
              <h3> Try things out.</h3>
              See how they work in reality.
            </div>

            <div>
              <ContentBlockImage bg="5962DF">
                <img src={npm} alt="Evaluate npm modules" />
              </ContentBlockImage>
              <h3>Evaluate npm modules.</h3>
              See what works for your project.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={components} alt="Build Components" />
              </ContentBlockImage>
              <h3>Test out components.</h3>
              Create functional examples.
            </div>
          </ContentBlock>
          <div
            css={`
              margin-top: 120px;
              margin-bottom: 56px;
            `}
          >
            <Subtitle>
              <H6>Collaboration</H6>
              Share With a Click
            </Subtitle>
          </div>
          <FeaturedImage bg={bg1}>
            <img
              ref={parallaxRef1}
              src={share}
              alt="Share fast"
              css={`
                width: 60rem;

                ${props => props.theme.breakpoints.md} {
                  margin-top: 4rem;
                }
              `}
            />
          </FeaturedImage>
          <ContentBlock cols="4" small>
            <div>
              <h3>Share code & creations.</h3>
              With friends, colleagues, or the world.
            </div>
            <div>
              <h3>Provide reproducibles.</h3>
              When creating GitHub issues.
            </div>
            <div>
              <h3>Explain with code.</h3>
              When asking or answering on Stack Overflow or Twitter.
            </div>
            <div>
              <h3>Embed code examples.</h3>
              In blog posts on Medium, DEV, or elsewhere.
            </div>
          </ContentBlock>
          <Quote>
            <img src={roy} width="254px" alt="Roy Derks" />
            <h3
              css={`
                max-width: 60rem;
              `}
            >
              “I often use CodeSandbox to create demos or try out new JavaScript
              features or packages.”{' '}
            </h3>
            <h4>Roy Derks, Engineering Manager, Vandebron</h4>
          </Quote>

          <div>
            <Subtitle>Go Pro</Subtitle>
          </div>

          <ContentBlock>
            <div>
              <ContentBlockImage bg="5962DF">
                <img src={lock} alt="Build in private" />
              </ContentBlockImage>
              <h3>Build in private</h3>
              Make sandboxes private and use private GitHub repos.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={people} alt="Share with a team or clients" />
              </ContentBlockImage>
              <h3>Share with a team or clients</h3>
              Set sandbox permissions to restrict forking or downloading code.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={code} alt="Create without limits" />
              </ContentBlockImage>
              <h3>Create without limits</h3>
              Get more file storage space and higher upload limits.
            </div>
          </ContentBlock>

          <div
            css={`
              margin: auto;
              display: flex;
              justify-content: center;
              margin: 96px auto;
            `}
          />
        </div>

        <CTA
          title="For power-users & freelancers.
          "
          subtitle="Keep work private, get more space and higher upload limits.
          "
          cta="Go Pro"
          link="/pricing"
        />
      </Wrapper>
    </Layout>
  );
};
