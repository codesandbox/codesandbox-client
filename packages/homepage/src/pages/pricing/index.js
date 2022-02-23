import React from 'react';
import styled from 'styled-components';

import Layout from '../../components/layout';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import { usePricing } from './_utils';
import { Intro } from './_intro';
import { PersonalPro } from './_personal-pro';

const Section = styled.div`
  margin-bottom: 280px;
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
      </SectionWrapper>
    </Layout>
  );
};

export default Pricing;
