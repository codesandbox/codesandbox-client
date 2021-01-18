import React from 'react';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
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
  CTABottom,
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
        margin: 2rem 0;
        `}
      >
        <Button cta href="https://codesandbox.io/s/">
          Get Started
        </Button>
      </div>
      <div>
        <div>
         
          <Subtitle as="h2">
          <H6>Prototyping</H6>
            Prototype Quickly</Subtitle>
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

        <div >
         
          <Subtitle>
          <H6 center>Learning</H6>
            Experiment Easily
          </Subtitle>
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
     
          <Subtitle>
          <H6>Collaboration</H6>
            Share With a Click</Subtitle>
        </div>
        <FeaturedImage bg={bg1}>
          <img
            src={share}
            alt="Share fast"
            css={`
              width: 900px;
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
        <Quote>
          <img src={roy} width="254px" alt="Roy Derks" />
          <h3     css={`max-width:60rem;`}>
            “I often use CodeSandbox to create demos or try out new JavaScript
            features or packages.”{' '}
          </h3>
          <h4>Roy Derks, Engineering Manager, Vandebron</h4>
        </Quote>

        <div >
 
          <Subtitle >
          <H6 center>From $9 per month</H6>
            Go Pro
          </Subtitle>
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
    <Button cta href="https://codesandbox.io//">
      Go Pro
    </Button>
  </div>
      
      </div>
    </Wrapper>
  </Layout>
);
