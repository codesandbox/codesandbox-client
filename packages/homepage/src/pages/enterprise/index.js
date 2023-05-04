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

import ide from './images/ide.png';
import cloud from './images/cloud.svg';
import settings from './images/settings.svg';
import bg from './images/bg.png';

import toggle from './images/toggle.svg';
import patterns from './images/patterns.svg';
import people from './images/people.svg';
import brian from './images/brian.png';
import briefcase from './images/briefcase.svg';

export default () => {
  const parallaxRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      applyParallax(parallaxRef.current, {
        speed: 1.2,
        center: true,
      });
    }
  }, [prefersReducedMotion]);
  return (
    <Layout>
      <TitleAndMetaTags title="Enterprise Plan - CodeSandbox" />
      <Wrapper>
        <TitleWrapper>
          <Title>Accelerate innovation.</Title>
        </TitleWrapper>
        <Description>
          Move faster and innovate more with better code collaboration. Combined
          with the infrastructure and support options your organization demands.
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
            <Subtitle>
              <H6>Collaboration</H6>
              Build in the open.
            </Subtitle>
          </div>
          <FeaturedImage bg={bg}>
            <img
              src={ide}
              ref={parallaxRef}
              alt="  Build in the open"
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
              <h3> Create faster together.</h3>
              Work without bottlenecks—view and edit code or review apps without
              friction, all in the browser.
            </div>

            <div>
              <h3>Build on better feedback.</h3>
              Get direct, actionable feedback into your development process
              earlier and more often to ship better products.
            </div>

            <div>
              <h3>Bring in all stakeholders.</h3>
              Seamless sharing means you can open up the development process to
              your whole organization.
            </div>
          </ContentBlock>

          <div>
            <Subtitle center>
              <H6 center>Prototyping</H6>
              Share design <br /> system knowledge.
            </Subtitle>
          </div>

          <ContentBlock>
            <div>
              <ContentBlockImage bg="5962DF">
                <img src={toggle} alt="Socialize your design system" />
              </ContentBlockImage>
              <h3> Socialize your design system.</h3>
              Go beyond static docs and share real, working demos, and live code
              examples.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={patterns} alt="Share patterns, not snippets." />
              </ContentBlockImage>
              <h3>Share patterns, not snippets.</h3>
              Combine components in sandboxes that exemplify best practices.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={people} alt="Get teams together." />
              </ContentBlockImage>
              <h3>Get teams together.</h3>
              Enable design, QA, and development to learn from each other and
              work closer together.
            </div>
          </ContentBlock>
          <Quote>
            <img src={brian} width="254px" alt="Brian Vaughn" />
            <h3>
              “It’s dramatically improved my <br /> experience of sharing
              ideas.”
            </h3>
            <h4>Brian Vaughn, Software Engineer, Facebook</h4>
          </Quote>

          <div>
            <Subtitle center>
              <H6 center>Contact Sales</H6>
              For Enterprise
            </Subtitle>
          </div>

          <ContentBlock>
            <div>
              <ContentBlockImage bg="151515">
                <img
                  src={cloud}
                  alt="cloud"
                  css={`
                    display: block;
                    transform: translateX(7%);
                  `}
                />
              </ContentBlockImage>
              <h3>On-prem or private cloud</h3>
              Infrastructure options that meet your organization’s unique needs.
            </div>

            <div>
              <ContentBlockImage bg="151515">
                <img src={settings} alt="settings" />
              </ContentBlockImage>
              <h3>Custom controls</h3>
              Enable effortless collaboration without compromising on security.
            </div>

            <div>
              <ContentBlockImage bg="5962DF">
                <img
                  src={briefcase}
                  alt="Support for enterprise needs

"
                />
              </ContentBlockImage>
              <h3>Support for enterprise needs</h3>
              Dedicated support focused on delivering your success.
            </div>
          </ContentBlock>
        </div>

        <CTA
          title="Custom deploy options & support."
          subtitle="Get the security and support your organization needs."
          cta="Contact us"
          link="mailto:support@codesandbox.io"
        />
      </Wrapper>
    </Layout>
  );
};
