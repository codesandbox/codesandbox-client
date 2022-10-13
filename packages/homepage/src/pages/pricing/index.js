import React from 'react';
import styled from 'styled-components';

import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import chevronRight from './assets/chevronRight.svg';

import { usePricing } from './_utils';
import { Intro } from './_intro';
import { Plans } from './_plans';
import { Testimonial } from './_testimonials';
import { Title } from './_elements';

const Overflow = styled.div`
  overflow: hidden;
`;

const Section = styled.div`
  position: relative;
  margin-bottom: 172px;

  @media (min-width: 769px) {
    margin-bottom: 150px;
  }
`;

const Container = styled.div`
  max-width: 954px;
  margin: auto;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const FAQGridItem = styled.div`
  width: 100%;
  max-width: 384px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FAQGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 62px;

  @media (min-width: 376px) {
    margin-top: 72px;
  }

  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 96px;
  }
`;

const FAQLabel = styled.p`
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #808080;
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
    transition: transform 0.2s ease;
  }
  &:hover img {
    transform: translateX(0.1em);
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
      </Overflow>

      <Section>
        <Container>
          <Plans />
        </Container>
      </Section>

      <Section>
        <Testimonial />
      </Section>

      <Section>
        <Container>
          <Title css={{ textAlign: 'center' }}>Can't find what you need?</Title>
          <FAQGrid>
            <FAQGridItem>
              <FAQLabel>
                We can provide more flexible free plans for educators and open
                source contributors.
              </FAQLabel>
              <FAQLink
                as="a"
                href="mailto:support@codesandbox.io?subject=Education and Open Source plan&body=!Fill or remove before merging!"
                target="_blank"
              >
                Request access
                <img src={chevronRight} width="16" alt="" />
              </FAQLink>
            </FAQGridItem>
            <FAQGridItem>
              <FAQLabel>
                If you have specific needs, we’ll work on finding a solution
                that works for you.
              </FAQLabel>
              <FAQLink
                as="a"
                href="mailto:support@codesandbox.io?subject=Custom solutions&body=!Fill or remove before merging!"
                target="_blank"
              >
                Contact us
                <img src={chevronRight} width="16" alt="" />
              </FAQLink>
            </FAQGridItem>
          </FAQGrid>
        </Container>
      </Section>
    </Layout>
  );
};

export default Pricing;
