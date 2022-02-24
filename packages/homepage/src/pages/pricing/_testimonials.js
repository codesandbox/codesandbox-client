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
          <p>"Digital product development, reimagined.”</p>
          <p>Dylan Field</p>
          <p>Founder and CEO, Figma</p>
        </Column>
        <Column>
          <p>Accelerating developers and product teams</p>

          {logos.map(source => (
            <img src={source} alt="company logo" />
          ))}
        </Column>
        <Column>
          <p>
            "Using CodeSandbox has completely revolutionized how we ship digital
            products.”
          </p>

          <p>Koen Bok</p>
          <p>Founder and CEO, Framer</p>
        </Column>
        <Column>
          <p>as featured on Product Hunt</p>

          <p>"A glimpse at the future of software development now.”</p>
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
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;

  width: 40%;

  padding: 72px 112px;

  &:first-child,
  &:last-child {
    width: 60%;
  }

  color: #0f0e0e;
`;
