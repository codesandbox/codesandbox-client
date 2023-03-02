import React, { useRef, useEffect } from 'react';

import { applyParallax } from '../../utils/parallax';
import usePrefersReducedMotion from '../../utils/isReducedMOtion';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import CTA from '../../components/CTA';
import Button from '../../components/Button';
import { Description } from '../../components/Typography';

import {
  ContentBlock,
  Title,
  Subtitle,
  TitleWrapper,
  Wrapper,
  FeaturedImage,
} from '../../components/LayoutComponents';

import team from './images/team-settings.png';
import bg from './images/bg.png';
import madetoshare from './images/madetoshare.png';
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
      <TitleAndMetaTags title="Knowledge Sharing - CodeSandbox" />
      <Wrapper>
        <TitleWrapper>
          <Title>
            Share knowledge <br /> and learn together.
          </Title>
        </TitleWrapper>
        <Description>
          Use code, apps, and templates collectively. Learn from each other and
          bake in best practice.
        </Description>
        <div
          css={`
            margin: auto;
            display: flex;
            justify-content: center;
            margin: 2rem 0;
          `}
        >
          <Button big href="https://codesandbox.io/s/">
            Get Started
          </Button>
        </div>
        <div>
          <div>
            <Subtitle as="h2">Team dashboards</Subtitle>
          </div>
          <FeaturedImage
            css={`
              height: 468px;
              padding: 0 1rem;

              ${props => props.theme.breakpoints.md} {
                height: 200px;
              }
            `}
            bg={bg}
          >
            <img
              src={team}
              ref={parallaxRef}
              alt="Team dashboards"
              css={`
                width: 1022px;
              `}
            />
          </FeaturedImage>
          <ContentBlock>
            <div>
              <h3>Team templates</h3>
              Provide starting points for new projects, pre-configured with
              styles, libraries, and settings to bake in best practice.
            </div>

            <div>
              <h3>Folders</h3>
              Subdivide your dashboard by organizing apps, hiring challenges,
              prototypes, and bug repros into folders.
            </div>

            <div>
              <h3>Team member management</h3>
              Control who can view and add comments, or edit sandboxes, so you
              safely share by default.
            </div>
          </ContentBlock>

          <div>
            <div>
              <Subtitle>Embeds</Subtitle>
            </div>
            <iframe
              css={`
                border: 0;
                width: 100%;
                height: 385px;
              `}
              title="embed-example"
              src={`https://codesandbox.io/embed/static-2lqup?fontsize=14&hidenavigation=true&hidedevtools=true`}
            />
            <ContentBlock>
              <div>
                <h3> Show code and previews</h3>
                Show code, the running app, or both at the same time to share an
                idea or communicate progress.
              </div>

              <div>
                <h3>Lightweight</h3>
                Designed to be lightweight yet powerful, our embeds won’t slow
                you down.
              </div>

              <div>
                <h3>Embed anywhere</h3>
                Embed sandboxes in docs, blog posts, and websites. Or the tools
                you use to get work done.
              </div>
            </ContentBlock>
          </div>
          <div>
            <div>
              <Subtitle>Made for sharing.</Subtitle>
            </div>
            <FeaturedImage bg={bg1}>
              <img
                src={madetoshare}
                ref={parallaxRef1}
                alt="made to share"
                css={`
                  width: 60rem;
                  ${props => props.theme.breakpoints.md} {
                    margin-top: 4rem;
                  }
                `}
              />
            </FeaturedImage>
            <ContentBlock>
              <div>
                <h3>Secure, shareable links</h3>
                Share code, work together or get feedback with a secure link
                that’s ready to share.
              </div>

              <div>
                <h3>Team member invites</h3>
                Invite members via email or username. Get your entire team on
                board with an invite link.
              </div>

              <div>
                <h3>No install or downloads</h3>
                With nothing to install or download, folks just need a web
                browser to get involved.
              </div>
            </ContentBlock>
          </div>
        </div>

        <CTA
          title="Come together to create."
          subtitle="Code online in real-time or asynchronously with your team."
          cta="Get Started"
          link="/s"
        />
      </Wrapper>
    </Layout>
  );
};
