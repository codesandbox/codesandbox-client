import React from 'react';
import styled from 'styled-components';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import { Intro } from './_intro';
import { Plans } from './_plans';
import { PersonalPlan } from './_personal-plans';
import { Subscribe } from './_subscribe';
import { Testimonials } from './_testimonials';
import { ComparePlans } from './_compare-plans';
import { FAQ } from './_faq';

const Section = styled.div`
  margin-bottom: 280px;
`;

const SectionWrapper = styled.div`
  ${Section}:first-child {
    margin-top: 140px;
  }
`;

const Pricing = () => {
  return (
    <Layout>
      <TitleAndMetaTags title="Pricing - CodeSandbox" />

      <SectionWrapper>
        <Section>
          <Intro />
        </Section>

        <Section>
          <Plans />
        </Section>

        <PersonalPlan />

        <Subscribe />

        <Testimonials />
        <ComparePlans />
        <FAQ />
      </SectionWrapper>
    </Layout>
  );
};

export default Pricing;
