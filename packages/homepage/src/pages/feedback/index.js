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
  ContentBlockImage,
  FeaturedImage,
} from '../../components/LayoutComponents';

import ide from './images/ide.png';
import bg from './images/bg.png';
import bg1 from './images/bg1.png';
import notifications from './images/notifications.png';

import comments from './images/comments.svg';
import comments1 from './images/comments1.svg';
import comments2 from './images/comments2.svg';

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
      <TitleAndMetaTags title="Feedback - CodeSandbox" />
      <Wrapper>
        <TitleWrapper>
          <Title>
            Get better feedback from <br /> your whole team.
          </Title>
        </TitleWrapper>
        <Description>
          Give and get feedback, on code or visuals, right in the editor. Take
          action and move forward faster.
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
            Get started
          </Button>
        </div>
        <div>
          <div>
            <Subtitle as="h2">Keep everyone in the loop.</Subtitle>
          </div>
          <FeaturedImage
            bg={bg}
            css={`
              justify-content: flex-start;
              ${props => props.theme.breakpoints.md} {
                margin-top: 4rem;
              }
            `}
          >
            <img
              ref={parallaxRef}
              src={ide}
              alt="Keep everyone in the loop"
              css={`
                width: 971px;
                ${props => props.theme.breakpoints.md} {
                  margin-top: 4rem;
                }
              `}
            />
          </FeaturedImage>
          <ContentBlock>
            <div>
              <h3>Unlimited viewers</h3>
              Get all stakeholders involved. Invite unlimited viewers for free
              to review and provide feedback.
            </div>

            <div>
              <h3>Role-based permissions</h3>
              So you can control who can view and add comments, edit a sandbox,
              or administrate your team.
            </div>

            <div>
              <h3>Shareable links</h3>
              Per sandbox URLs with HTTPS support for secure project sharing.
            </div>
          </ContentBlock>

          <div
            css={`
              margin-top: 120px;
              margin-bottom: 56px;
            `}
          >
            <Subtitle left as="h2">
              Know the context.
            </Subtitle>
          </div>

          <ContentBlock>
            <div>
              <ContentBlockImage bg="5962DF">
                <img src={comments} alt="Code comments" />
              </ContentBlockImage>
              <h3> Code comments</h3>
              Add feedback about a sandbox as a whole or on specific code lines.
              Ask questions, get answers, or do quick code reviews.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={comments1} alt="Preview comments" />
              </ContentBlockImage>
              <h3>Preview comments</h3>
              Add comments about visuals right on the preview. We capture
              browser and resolution details too for quick repros.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={comments2} alt="In-editor" />
              </ContentBlockImage>
              <h3>In-editor feedback</h3>
              Comments are shown right where you need it, alongside your code in
              the tool where you’re working.
            </div>
          </ContentBlock>

          <div
            css={`
              margin-top: 120px;
              margin-bottom: 200px;
            `}
          >
            <div>
              <Subtitle as="h2">Stay up to date.</Subtitle>
              <h6
                css={`
                  font-style: normal;
                  font-weight: normal;
                  font-size: 23px;
                  line-height: 27px;
                  text-align: center;
                  max-width: 600px;
                  color: #999999;
                  margin: 0 auto 4rem auto;
                `}
              >
                With email or in-app notifications about new comments and
                invites, you won’t miss a thing.
              </h6>
            </div>
            <FeaturedImage
              bg={bg1}
              css={`
                justify-content: flex-start;
              `}
            >
              <img
                ref={parallaxRef1}
                src={notifications}
                alt="Notifications"
                css={`
                  width: 996px;
                  ${props => props.theme.breakpoints.md} {
                    margin-top: 4rem;
                  }
                `}
              />
            </FeaturedImage>
          </div>
        </div>

        <CTA
          title="Start testing your ideas."
          subtitle="Get better feedback faster to validate and iterate."
          cta="Get started"
          link="/s"
        />
      </Wrapper>
    </Layout>
  );
};
