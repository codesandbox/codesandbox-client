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
} from '../../components/LayoutComponents';

import ide from './images/ide.png';
import bg from './images/bg.png';
import bg1 from './images/bg1.png';

import repo from './images/repo.svg';
import registry from './images/registry.svg';
import privateImg from './images/private.svg';
import deps from './images/deps.png';

export default () => (
  <Layout>
    <TitleAndMetaTags title="Prototyping - Codesandbox" />
    <Wrapper>
      <TitleWrapper>
        <Title>Quickly prototype ideas with code</Title>
      </TitleWrapper>
      <Description>
        Create real, working prototypes. Test ideas earlier, iterate more, and
        create better products
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
          <Subtitle>Keep everyone in the loop</Subtitle>
        </div>
        <FeaturedImage bg={bg}>
          <img
            src={ide}
            alt=""
            css={`
              width: 961px;
            `}
          />
        </FeaturedImage>
        <ContentBlock>
          <div>
            <h3>Setup-free</h3>
            We've templates optimized for frameworks, including React, Vue,
            Angular, and others, to kickstart new projects.
          </div>

          <div>
            <h3>Superfast</h3>
            Our custom bundler gets code running as quickly as possible, perfect
            for blazing fast development in the browser.
          </div>

          <div>
            <h3>Shareable</h3>
            Sandboxes are shareable by default. Share a secure URL, or invite
            folks to join and collaborate on code, or provide feedback.
          </div>
        </ContentBlock>

        <div
          css={`
            margin-top: 120px;
            margin-bottom: 56px;
          `}
        >
          <Subtitle left>
            <H6 center>Collaboration</H6>
            Code in public, or private
          </Subtitle>
        </div>

        <ContentBlock>
          <div>
            <ContentBlockImage bg="5962DF">
              <img src={repo} alt="" />
            </ContentBlockImage>
            <h3>Private repos</h3>
            Import existing projects from private repos, or commit from
            CodeSandbox and continue working on them locally.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={registry} alt="" />
            </ContentBlockImage>
            <h3>Custom registry support</h3>
            Leverage your own internal packages, and build with your design
            system or component library.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={privateImg} alt="" />
            </ContentBlockImage>
            <h3>Private sandboxes</h3>
            Make sandboxes public, private, or unlisted. Per sandbox, or across
            a whole workspace.
          </div>
        </ContentBlock>

        <div
          css={`
            margin-top: 160px;
            margin-bottom: 200px;
          `}
        >
          <div>
            <Subtitle>
              Create static sites, components, <br /> or full-stack web apps
            </Subtitle>
          </div>
          <FeaturedImage bg={bg1}>
            <img
              src={deps}
              alt=""
              css={`
                width: 962px;
              `}
            />
          </FeaturedImage>
          <ContentBlock>
            <div>
              <h3>NPM Support</h3>
              Add any of the 1M+ dependencies on npm, or your own private
              packages.
            </div>

            <div>
              <h3>Instant Preview</h3>
              See changes as you make them, with no waiting on builds or
              deploys.
            </div>

            <div>
              <h3>Static File Hosting</h3>
              Add your files directly in the sandbox for easy access and
              management.
            </div>
          </ContentBlock>
        </div>
        <CTABottom />
      </div>
    </Wrapper>
  </Layout>
);
