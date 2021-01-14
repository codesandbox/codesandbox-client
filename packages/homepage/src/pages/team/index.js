import React from 'react';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import Button from '../../components/Button';
import { Description, H6 } from '../../components/Typography';

import {
  CTABottom,
  ContentBlock,
  Title,
  TitleWrapper,
  Quote,
  Wrapper,
  ContentBlockImage,
  FeaturedImage,
} from '../../components/LayoutComponents';

import teamStart from './images/team-start.png';
import npm from './images/npm.svg';
import bg from './images/bg.png';
import bg1 from './images/bg1.png';

import shareDesign from './images/share.svg';
import planets from './images/planets.svg';
import embed from './images/embed.svg';
import comments from './images/comments.png';
import rob from './images/rob.png';
import settings from './images/settings.svg';
import money from './images/money.svg';
import sso from './images/sso.svg';
import analytics from './images/analytics.svg';
import workspaces from './images/workspaces.svg';

export default () => (
  <Layout>
    <TitleAndMetaTags title="Team Plan - Codesandbox" />
    <Wrapper>
      <TitleWrapper>
        <Title>Keep development work flowing</Title>
      </TitleWrapper>
      <Description>
        Build better things faster with a workspace that makes code
        collaboration effortless for your entire team.
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
        <Button cta href="https://codesandbox.io/s/">
          Get Started
        </Button>
      </div>
      <div
        css={`
          padding-top: 128px;
        `}
      >
        <div>
          <H6>Prototyping</H6>
          <Title as="h2">Rapid Prototyping</Title>
        </div>
        <FeaturedImage bg={bg}>
          <img
            src={teamStart}
            alt="Team Dahsboard"
            css={`
              width: 1063.36px;
            `}
          />
        </FeaturedImage>
        <ContentBlock>
          <div>
            <h3> Don’t wait on builds </h3>
            Get started on new projects with no setup, and see changes live as
            you make them and build without bottlenecks.
          </div>

          <div>
            <h3>Create together.</h3>
            Come together with a link—no environment switching, or slow
            screenshares. Team up in real-time or asynchronously and go from
            idea to done faster.
          </div>

          <div>
            <h3>Know if ideas work in reality.</h3>
            Bring ideas to life with code prototypes that don’t just look real,
            but are real. Discover whether the theory works in practice.
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
            Knowledge Sharing
          </Title>
        </div>

        <ContentBlock>
          <div>
            <ContentBlockImage bg="151515">
              <img src={shareDesign} alt="fast" />
            </ContentBlockImage>
            <h3> Socialize your design system.</h3>
            Remove barriers to collaboration with a shared workspace. Organize
            apps, hiring tests, prototypes, and bug repros in folders.
          </div>

          <div>
            <ContentBlockImage bg="5962DF">
              <img src={planets} alt="planets" />
            </ContentBlockImage>
            <h3>Bake in best practice. </h3>
            Custom workspace templates provide starting points for your team,
            configured with your styles, libraries, and settings.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={embed} alt="Embeds" />
            </ContentBlockImage>
            <h3>Embed in tools & docs.</h3>
            Show, don’t just tell. Bring live code examples and prototypes in to
            your workflow, embedded in the tools you already use.
          </div>
        </ContentBlock>
        <div
          css={`
            margin-top: 120px;
            margin-bottom: 56px;
          `}
        >
          <H6>Collaboration</H6>
          <Title as="h2">Better Feedback</Title>
        </div>
        <FeaturedImage
          bg={bg1}
          css={`
            justify-content: flex-start;
          `}
        >
          <img
            src={comments}
            alt="comment on code"
            css={`
              width: 1114px;
            `}
          />
        </FeaturedImage>
        <ContentBlock>
          <div>
            <h3>Involve the entire team</h3>
            Designers, Marketers, PMs, whoever. Invite unlimited viewers for
            free, and review or comment on prototypes for greater transparency,
            and fewer surprises.
          </div>

          <div>
            <h3>Get feedback in context.</h3>
            Comment on code, or drop a marker and provide feedback on visuals.
            All directly in the editor where it’s needed, along with useful
            metadata that makes it actionable.
          </div>

          <div>
            <h3>Make it a conversation.</h3>
            Reply to create a thread, include screenshots, @mention those you
            need to keep in the loop, and resolve to archive it when you’re
            done.
          </div>
        </ContentBlock>
        <Quote>
          <img src={rob} width="254px" alt="Rob Eisenberg" />
          <h3>“This is a great way to prototype and share ideas.”</h3>
          <h4>Rob Eisenberg, Software Architect, Universal Audio</h4>
        </Quote>

        <div
          css={`
            margin-top: 120px;
            margin-bottom: 56px;
          `}
        >
          <H6 left>$24 per editor a month</H6>
          <Title left as="h2">
            For Teams
          </Title>
        </div>

        <ContentBlock>
          <div>
            <ContentBlockImage bg="5962DF">
              <img
                src={npm}
                alt="Private NPM"
                css={`
                  display: block;
                  transform: translateX(7%);
                `}
              />
            </ContentBlockImage>
            <h3>Private npm packages</h3>
            Build with your design system using packages from your own registry.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={money} alt="" />
            </ContentBlockImage>
            <h3>Centralized billing</h3>
            Get everyone in a single account, for easier team management &
            billing.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={settings} alt="" />
            </ContentBlockImage>
            <h3>Workspace settings</h3>
            Set default privacy and permission settings across your workspace.
          </div>
        </ContentBlock>
        <div
          css={`
            margin-top: 240px;
            margin-bottom: 56px;
          `}
        >
          <H6 left>$45 per editor a month</H6>
          <Title left as="h2">
            For Organizations
          </Title>
        </div>

        <ContentBlock
          css={`
            margin-bottom: 200px;
          `}
        >
          <div>
            <ContentBlockImage bg="151515">
              <img src={sso} alt="" />
            </ContentBlockImage>
            <h3>Single sign-on (SSO)</h3>
            Integrate your identity management system and enforce SSO.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={analytics} alt="" />
            </ContentBlockImage>
            <h3>Analytics</h3>
            Measure impact and refine creations with sandbox analytics.
          </div>

          <div>
            <ContentBlockImage bg="5962DF">
              <img src={workspaces} alt="" />
            </ContentBlockImage>
            <h3>Multiple workspaces</h3>
            Bring multiple teams together in a single account to collaborate.
          </div>
        </ContentBlock>
        <CTABottom />
      </div>
    </Wrapper>
  </Layout>
);
