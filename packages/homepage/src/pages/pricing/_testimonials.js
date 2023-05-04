import React from 'react';

import styled from 'styled-components';
import { Title } from './_elements';

import algolia from './assets/algolia.png';
import atlassian from './assets/atlassian.png';
import framer from './assets/framer.png';
import microsoft from './assets/microsoft.png';
import shopify from './assets/shopify.png';
import stripe from './assets/stripe.png';
import quote from './assets/quote.svg';
import peggy from './assets/Peggy.jpg';
import brian from './assets/Brian.jpg';
import joonie from './assets/Joonie.jpg';

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
          <BigTitle>CodeSandbox continues to amaze me every day.”</BigTitle>
          <AvatarHolder>
            <img src={peggy} alt="Peggy Rayzis" />
            <div>
              <TestimonialTitle>Peggy Rayzis</TestimonialTitle>
              <TestimonialRole>
                Engineering Manager, Apollo GraphQL
              </TestimonialRole>
            </div>
          </AvatarHolder>
        </Column>
        <Column>
          <Caption css={{ textAlign: 'center', marginBottom: 16 }}>
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
            It's dramatically improved my experience of sharing ideas.”
          </MinorTitle>

          <AvatarHolder>
            <img src={brian} alt="Brian Vaughn" />
            <div>
              <TestimonialTitle>Brian Vaughn</TestimonialTitle>
              <TestimonialRole>
                Software Engineer, React Core Team
              </TestimonialRole>
            </div>
          </AvatarHolder>
        </Column>
        <Column>
          <BigTitle>It feels much more like my local environment.”</BigTitle>
          <AvatarHolder>
            <img src={joonie} alt="Jonnie Hallman" />
            <div>
              <TestimonialTitle>Jonnie Hallman</TestimonialTitle>
              <TestimonialRole>Designer Developer, Stripe</TestimonialRole>
            </div>
          </AvatarHolder>
        </Column>
      </FullSection>
    </>
  );
};

/**
 * Elements
 */
const AvatarHolder = styled.div`
  display: flex;
  align-items: center;

  img {
    margin-right: 16px;
    width: 48px;
    height: 48px;
  }
`;

const FullSection = styled.div`
  background: #fff;
  display: flex;
  flex-wrap: wrap;
`;

const Column = styled.div`
  color: #0f0e0e;

  border-bottom: 1px solid #000;

  padding: 48px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media (min-width: 768px) {
    padding: 62px;
    width: 45%;
    border-right: 1px solid #000;

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
  line-height: 1.1;
  letter-spacing: -0.03em;
  position: relative;
  margin: 0;
  margin-bottom: 60px;

  font-size: 40px;

  @media (min-width: 769px) {
    font-size: 48px;
  }

  @media (min-width: 1025px) {
    font-size: 64px;
  }

  @media (min-width: 1441px) {
    padding-right: 23%;
  }

  &:before {
    content: '';
    background: url(${quote}) center center;
    background-size: cover;
    width: 0.36em;
    height: 0.26em;
    position: absolute;
    left: -0.5em;
    top: 0.17em;
  }
`;

const MinorTitle = styled(BigTitle)`
  font-size: 24px;
  line-height: 1.3;

  @media (min-width: 769px) {
    font-size: 32px;
  }
`;

const Caption = styled.p`
  font-size: 13px;
  margin: 0;

  @media (min-width: 769px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

const TestimonialTitle = styled.p`
  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;
  font-size: 18px;
  margin-bottom: 2px;

  @media (min-width: 769px) {
    font-size: 24px;
    line-height: 28px;
  }
`;

const TestimonialRole = styled.p`
  font-weight: 400;
  letter-spacing: -0.01em;
  margin: 0;
  font-size: 13px;

  @media (min-width: 769px) {
    font-size: 16px;
    line-height: 24px;
  }
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
      max-width: 232px;
    }
  }
`;
