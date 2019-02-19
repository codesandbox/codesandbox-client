import React from 'react';
import { graphql } from 'gatsby';
import { Content } from './_elements';
import Navigation from './_navigation';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import PageContainer from '../../components/PageContainer';

export default ({ data: { markdownRemark } }) => (
  <Layout>
    <TitleAndMetaTags title="CodeSandbox - Terms and Conditions" />
    <PageContainer width={1024}>
      <Navigation />
      <Content dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
    </PageContainer>
  </Layout>
);

export const pageQuery = graphql`
  query Terms {
    markdownRemark(id: { eq: "c591e19c-94a0-5b0b-be4a-b42142aeffe7" }) {
      html
    }
  }
`;
