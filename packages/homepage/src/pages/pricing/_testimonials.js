import React from 'react';

import styled from 'styled-components';
import { Title } from './_elements';

import algolia from './assets/algolia.png';
import atlassian from './assets/atlassian.png';
import framer from './assets/framer.png';
import microsoft from './assets/microsoft.png';
import shopify from './assets/shopify.png';
import stripe from './assets/stripe.png';

const logos = [microsoft, shopify, atlassian, stripe, framer, algolia];

export const Testimonial = () => {
  return (
    <>
      <Title
        css={{ textAlign: 'center', maxWidth: 967, margin: '0 auto 160px' }}
      >
        Don't just take our word for it. Take it from our users.
      </Title>

      <FullSection>
        <Column>
          <BigTitle>Digital product development, reimagined.”</BigTitle>
          <div>
            <TestimonialTitle>Dylan Field</TestimonialTitle>
            <TestimonialRole>Founder and CEO, Figma</TestimonialRole>
          </div>
        </Column>
        <Column>
          <Caption css={{ textAlign: 'center' }}>
            Accelerating developers and product teams
          </Caption>

          <ImageGrid>
            {logos.map(source => (
              <img src={source} alt="company logo" />
            ))}
          </ImageGrid>
        </Column>
        <Column>
          <MinorTitle>
            Using CodeSandbox has completely revolutionized how we ship digital
            products.”
          </MinorTitle>

          <div>
            <TestimonialTitle>Koen Bok</TestimonialTitle>
            <TestimonialRole>Founder and CEO, Framer</TestimonialRole>
          </div>
        </Column>
        <Column>
          <Caption>as featured on Product Hunt</Caption>

          <BigTitle>
            A glimpse at the future of software development now.”
          </BigTitle>
        </Column>
      </FullSection>
    </>
  );
};

/**
 * Elements
 */
const FullSection = styled.div`
  background: #fff;
  display: flex;
  flex-wrap: wrap;
`;

const Column = styled.div`
  color: #0f0e0e;

  border-bottom: 1px solid #000;
  border-right: 1px solid #000;

  width: 40%;
  height: 40vw;
  max-height: 550px;
  padding: 72px 112px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:first-child,
  &:last-child {
    width: 60%;
  }
`;

const BigTitle = styled.p`
  font-family: 'TWKEverett', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 64px;
  line-height: 64px;
  letter-spacing: -0.03em;
  margin: 0;
  position: relative;
  padding-right: 26%;

  &:before {
    content: '"';
    position: absolute;
    left: -0.5em;
  }
`;

const MinorTitle = styled(BigTitle)`
  font-size: 32px;
  line-height: 42px;
`;

const Caption = styled.p`
  font-size: 16px;
  line-height: 24px;
  margin: 0;
`;

const TestimonialTitle = styled.p`
  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.01em;
  margin: 0;
`;

const TestimonialRole = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.01em;
  margin: 0;
`;

const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;

  > * {
    width: 50%;
  }
`;
