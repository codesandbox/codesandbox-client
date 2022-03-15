import React from 'react';
import styled from 'styled-components';

import Layout from '../../components/layout';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import { usePricing } from './_utils';
import { Intro } from './_intro';
import { PersonalPro } from './_personal-pro';
import { Plans } from './_plans';
import { Testimonial } from './_testimonials';
import { Title } from './_elements';
import chevronRight from './assets/chevronRight.svg';

const Overflow = styled.div`
  overflow: hidden;
`;

const Section = styled.div`
  position: relative;
  margin-bottom: 172px;

  @media (min-width: 769px) {
    margin-bottom: 280px;
  }
`;

const Container = styled.div`
  max-width: 954px;
  margin: auto;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const FAQLink = styled(Title)`
  color: #dcff50;
  text-align: center;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;

  @media (min-width: 769px) {
    font-size: 32px;
  }

  img {
    margin-left: 0.3em;
  }
`;

const Pricing = () => {
  const plansPayload = usePricing();

  return (
    <Layout noWrapperStyling>
      <TitleAndMetaTags title="Pricing - CodeSandbox" />
      <Overflow>
        <Section
          css={{
            marginTop: 72,
            '@media (min-width: 769px)': { marginTop: 140 },
          }}
        >
          <Container>
            <Intro plans={plansPayload} />
          </Container>
        </Section>

        <Section>
          <Container>
            <PersonalPro plans={plansPayload} />
          </Container>
        </Section>

        <Section>
          <Testimonial />
        </Section>

        <Section id="plans">
          <Container>
            <Plans />
          </Container>
        </Section>

        <Section>
          <Title css={{ textAlign: 'center' }}>Still have questions?</Title>

          {/* TODO */}
          <FAQLink as="a" href="/faq" target="_blank">
            Read our FAQ
            <img src={chevronRight} alt="link to" />
          </FAQLink>
        </Section>
      </Overflow>
    </Layout>
  );
};

export default Pricing;
