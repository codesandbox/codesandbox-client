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
        css={{
          textAlign: 'center',
          maxWidth: 967,
          margin: '0 auto 112px',
          '@media (min-width: 1441px)': { margin: '0 auto 160px' },
        }}
      >
        Don't just take our word for it. Take it from our users.
      </Title>

      <FullSection>
        <Column>
          <BigTitle css={{ marginBottom: 60 }}>
            Digital product development, reimagined.”
          </BigTitle>
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
          <MinorTitle css={{ marginBottom: 60 }}>
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

          <BigTitle css={{ marginTop: 60 }}>
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

  padding: 32px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 769px) {
    padding: 62px;
    width: 45%;

    &:first-child,
    &:last-child {
      width: 55%;
    }
  }

  @media (min-width: 1255px) {
    max-height: 550px;
    height: 40vw;

    width: 40%;
    padding: 72px 112px;

    &:first-child,
    &:last-child {
      width: 60%;
    }
  }
`;

const BigTitle = styled.p`
  font-family: 'TWKEverett', sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  position: relative;
  margin: 0;

  font-size: 40px;

  @media (min-width: 769px) {
    font-size: 48px;
  }

  @media (min-width: 1025px) {
    font-size: 64px;
  }

  @media (min-width: 1441px) {
    padding-right: 26%;
  }

  &:before {
    content: '"';
    position: absolute;
    left: -0.5em;
  }
`;

const MinorTitle = styled(BigTitle)`
  font-size: 18px;
  line-height: 1.3;

  @media (min-width: 769px) {
    font-size: 32px;
  }
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
    width: calc(100% / 2);
  }

  @media (min-width: 769px) {
    > * {
      width: calc(100% / 6);
    }
  }

  @media (min-width: 769px) {
    > * {
      width: 50%;
    }
  }
`;
