import React from 'react';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import Button from '../../components/Button';
import { Description, H6 } from '../../components/Typography';

import {
  ContentBlock,
  Title,
  TitleWrapper,
  Wrapper,
  ContentBlockImage,
  FeaturedImage,
} from './_elements';

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

export default () => (
  <Layout>
    <TitleAndMetaTags title="Personal Plan - Codesandbox" />
    <Wrapper>
      <TitleWrapper>
        <Title>Experiment and learn without setup hassle</Title>
      </TitleWrapper>
      <Description>
        Go straight to coding with instant sandboxes for rapid web development.
        Free for personal use.
      </Description>
      <div
        css={`
          margin: auto;
          display: flex;
          justify-content: center;
          margin-top: 96px;
          margin-bottom: 181px;
        `}
      >
        <Button cta>Get Started</Button>
      </div>
      <div
        css={`
          padding-top: 128px;
        `}
      >
        <div>
          <H6>Prototyping</H6>
          <Title as="h2">Prototype Quickly</Title>
        </div>
        <FeaturedImage bg={bg}>
          <img
            src={ide}
            alt="IDE"
            css={`
              width: 960px;
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

        <div
          css={`
            margin-top: 120px;
            margin-bottom: 56px;
          `}
        >
          <H6 left>Learning</H6>
          <Title left as="h2">
            Experiment Easily
          </Title>
        </div>

        <ContentBlock>
          <div>
            <ContentBlockImage bg="151515">
              <img src={fast} alt="fast" />
            </ContentBlockImage>
            <h3> Try things out.</h3>
            See how they work in reality.
          </div>

          <div>
            <ContentBlockImage bg="5962DF">
              <img src={npm} alt="npm" />
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
          <H6>Collaboration</H6>
          <Title as="h2">Share With a Click</Title>
        </div>
        <FeaturedImage bg={bg1}>
          <img
            src={share}
            alt="Share fast"
            css={`
              width: 396.35px;
            `}
          />
        </FeaturedImage>
        <ContentBlock cols="4" small center>
          <div>
            <h3>Share code and creations.</h3>
            With friends, colleagues, or the world.
          </div>

          <div>
            <h3>Provide reproducible bug reports.</h3>
            With friends, colleagues, or the world.
          </div>

          <div>
            <h3>Ask and answer questions with code.</h3>
            When creating GitHub issues.
          </div>
          <div>
            <h3>Ask and answer questions with code.</h3>
            On Stack Overflow or Twitter.
          </div>
        </ContentBlock>
        <div
          css={`
            min-height: 100vh;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          `}
        >
          <img src={roy} width="254px" alt="Roy Derks" />
          <h3
            css={`
              margin: 30px auto;
              font-weight: 900;
              font-size: 48px;
              line-height: 57px;
              color: #ffffff;
            `}
          >
            “I often use CodeSandbox to create demos or try out new JavaScript
            features or packages.”{' '}
          </h3>
          <h4
            css={`
              font-weight: normal;
              font-size: 23px;
              line-height: 27px;
              color: #ffffff;
            `}
          >
            Roy Derks, Engineering Manager, Vandebron
          </h4>
        </div>

        <div
          css={`
            margin-top: 120px;
            margin-bottom: 56px;
          `}
        >
          <H6 left>From $9 per month</H6>
          <Title left as="h2">
            Go Pro
          </Title>
        </div>

        <ContentBlock>
          <div>
            <ContentBlockImage bg="5962DF">
              <img src={lock} alt="Lock" />
            </ContentBlockImage>
            <h3>Build in private</h3>
            Make sandboxes private and use private GitHub repos.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={people} alt="People" />
            </ContentBlockImage>
            <h3>Share with a team or clients</h3>
            Set sandbox permissions to restrict forking or downloading code.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={code} alt="code" />
            </ContentBlockImage>
            <h3>Create without limits</h3>
            Get more space, higher upload limits, and unlimited invites.
          </div>
        </ContentBlock>
        <div
          css={`
            margin: auto;
            display: flex;
            justify-content: center;
            margin: 96px auto;
          `}
        >
          <Button cta>Get Started</Button>
        </div>
      </div>
    </Wrapper>
  </Layout>
);
