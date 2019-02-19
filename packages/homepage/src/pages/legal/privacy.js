import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Content } from './_elements';
import Navigation from './_navigation';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import PageContainer from '../../components/PageContainer';

export default () => (
  <Layout>
    <TitleAndMetaTags title="CodeSandbox - Privacy Policy" />
    <PageContainer width={1024}>
      <Navigation />
      <StaticQuery
        query={graphql`
          query {
            markdownRemark(id: { eq: "61d88176-8b26-5ec7-86db-c64d70676530" }) {
              html
            }
          }
        `}
        render={({ markdownRemark }) => (
          <Content dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
        )}
      />
    </PageContainer>
  </Layout>
);
