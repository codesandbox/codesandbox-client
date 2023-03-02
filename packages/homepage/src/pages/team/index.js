import React, { useRef, useEffect } from 'react';

import { applyParallax } from '../../utils/parallax';
import usePrefersReducedMotion from '../../utils/isReducedMOtion';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import Button from '../../components/Button';
import CTA from '../../components/CTA';
import { Description, H6 } from '../../components/Typography';

import {
  ContentBlock,
  Title,
  Subtitle,
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
      <TitleAndMetaTags title="Team Plan - CodeSandbox" />
      <Wrapper>
        <TitleWrapper>
          <Title>
            Keep development <br /> work flowing.
          </Title>
        </TitleWrapper>
        <Description>
          Build better things faster with a team dashboard that makes code
          collaboration effortless for your entire team.
        </Description>
        <div
          css={`
            margin: auto;
            display: flex;
            justify-content: center;
            margin: 2rem 0;
          `}
        >
          <Button cta href="https://codesandbox.io/dashboard/settings/new">
            Get Started
          </Button>
        </div>
        <div>
          <div>
            <Subtitle>
              <H6>Prototyping</H6>
              Rapid Prototyping
            </Subtitle>
          </div>
          <FeaturedImage bg={bg}>
            <img
              src={teamStart}
              ref={parallaxRef}
              alt="Team Dashboard"
              css={`
                width: 90rem;

                ${props => props.theme.breakpoints.md} {
                  margin-top: 4rem;
                }
              `}
            />
          </FeaturedImage>
          <ContentBlock>
            <div>
              <h3>Don’t wait on builds.</h3>
              Get started on new projects with no setup, and see changes live as
              you make them and build without bottlenecks.
            </div>

            <div>
              <h3>Create together.</h3>
              Come together with a link—no environment switching or slow
              screenshares—team up in real-time or asynchronously.
            </div>

            <div>
              <h3>Know if ideas work in reality.</h3>
              Bring ideas to life with code prototypes that don’t just look real
              but are real.
            </div>
          </ContentBlock>

          <div>
            <Title center>
              <H6 center>Learning</H6>
              Knowledge Sharing
            </Title>
          </div>

          <ContentBlock>
            <div>
              <ContentBlockImage bg="151515">
                <img src={shareDesign} alt="Share with your team by default" />
              </ContentBlockImage>
              <h3>Share with your team by default.</h3>
              Remove barriers to collaboration with a team dashboard. Organize
              apps, hiring tests, prototypes, and bug repros in folders.
            </div>

            <div>
              <ContentBlockImage bg="5962DF">
                <img src={planets} alt="Bake in best practice" />
              </ContentBlockImage>
              <h3>Bake in best practice. </h3>
              Custom project templates provide starting points for your team,
              configured with your styles, libraries, and settings.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={embed} alt="Embed in tools & docs." />
              </ContentBlockImage>
              <h3>Embed in tools & docs.</h3>
              Show, don’t just tell. Bring live code examples and prototypes
              into your workflow, embedded in the tools you already use.
            </div>
          </ContentBlock>
          <div>
            <Subtitle>
              <H6>Collaboration</H6>
              Better Feedback
            </Subtitle>
          </div>
          <FeaturedImage
            bg={bg1}
            css={`
              justify-content: flex-start;
            `}
          >
            <img
              ref={parallaxRef1}
              src={comments}
              alt="comment on code"
              css={`
                width: 900px;

                ${props => props.theme.breakpoints.md} {
                  margin-top: 4rem;
                }
              `}
            />
          </FeaturedImage>
          <ContentBlock>
            <div>
              <h3>Involve the entire team.</h3>
              Designers, Marketers, PMs, whoever. Invite unlimited viewers for
              free, and review or comment on prototypes for greater transparency
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
              need to keep in the loop, and archive it when you’re done.
            </div>
          </ContentBlock>
          <Quote>
            <img src={rob} width="254px" alt="Rob Eisenberg" />
            <h3>
              “This is a great way to
              <br /> prototype and share ideas.”
            </h3>
            <h4>Rob Eisenberg, Software Architect, Universal Audio</h4>
          </Quote>

          <div>
            <Subtitle>
              <H6>from $24 per editor a month</H6>
              For Teams
            </Subtitle>
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
              Build with your design system using packages from your own
              registry.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={money} alt="Centralized billing" />
              </ContentBlockImage>
              <h3>Centralized billing</h3>
              Get everyone in a single account for easier team management &
              billing.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={settings} alt="Team settings" />
              </ContentBlockImage>
              <h3>Team settings</h3>
              Set default privacy and permission settings across your team.
            </div>
          </ContentBlock>

          <CTA
            title="Collaborate with your team."
            subtitle="Test ideas earlier, iterate more and create better products with a team dashboard."
            cta="Go Pro"
            link="/pricing"
          />

          <div>
            <Subtitle>
              <H6 center>from $45 per editor a month</H6>
              For Organizations
            </Subtitle>
          </div>

          <ContentBlock>
            <div>
              <ContentBlockImage bg="151515">
                <img src={sso} alt="Single sign-on (SSO)" />
              </ContentBlockImage>
              <h3>Single sign-on (SSO)</h3>
              Integrate your identity management system and enforce SSO.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={analytics} alt="Analytics" />
              </ContentBlockImage>
              <h3>Analytics</h3>
              Measure impact and refine creations with sandbox analytics.
            </div>

            <div>
              <ContentBlockImage bg="5962DF">
                <img src={workspaces} alt="Multiple teams" />
              </ContentBlockImage>
              <h3>Multiple teams</h3>
              Bring multiple teams together in a single account to collaborate.
            </div>
          </ContentBlock>
        </div>

        <CTA
          title="For large or multiple teams."
          subtitle="Share code, apps, and templates. Learn from each other and bake in best practice."
          cta="Get early access"
          link="https://airtable.com/shrlgLSJWiX8rYqyG"
        />
      </Wrapper>
    </Layout>
  );
};
