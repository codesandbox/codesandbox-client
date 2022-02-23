import React from 'react';
import styled from 'styled-components';

import Layout from '../../components/layout';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import { usePricing } from './_utils';
import { Intro } from './_intro';
import { PersonalPro } from './_personal-pro';
import { Plans } from './_plans';
import { Title } from './_elements';

const Section = styled.div`
  margin-bottom: 280px;
  position: relative;
`;

const SectionWrapper = styled.div`
  width: 954px;
  margin: auto;

  ${Section}:first-child {
    margin-top: 140px;
  }
`;

const Pricing = () => {
  const plansPayload = usePricing();

  return (
    <Layout>
      <TitleAndMetaTags title="Pricing - CodeSandbox" />

      <SectionWrapper>
        <Section>
          <Intro plans={plansPayload} />
        </Section>

        <Section>
          <PersonalPro plans={plansPayload} />
        </Section>

        <Section id="plans">
          <Plans />
        </Section>

        <Section>
          <Title css={{ textAlign: 'center', maxWidth: 710, margin: 'auto' }}>
            {/* TODO: link */}
            For further inquiries, access our <a href="">FAQ</a>
          </Title>
        </Section>
      </SectionWrapper>
    </Layout>
  );
};

export default Pricing;
