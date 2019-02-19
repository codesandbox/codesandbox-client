import React from 'react';
import { graphql } from 'gatsby';
import { Content } from './_elements';
import Navigation from './_navigation';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import PageContainer from '../../components/PageContainer';

export default ({ data: { markdownRemark } }) => (
  <Layout>
    <TitleAndMetaTags title="CodeSandbox - Recent Updates" />
    <PageContainer width={1024}>
      <Navigation />
      <Content dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
    </PageContainer>
  </Layout>
);

export const pageQuery = graphql`
  query Privacy {
    markdownRemark(id: { eq: "61d88176-8b26-5ec7-86db-c64d70676530" }) {
      html
    }
  }
`;
