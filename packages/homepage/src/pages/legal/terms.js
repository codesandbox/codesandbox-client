import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import { Content } from './_elements';
import Navigation from './_navigation';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import PageContainer from '../../components/PageContainer';

export default () => (
  <Layout>
    <TitleAndMetaTags title="CodeSandbox - Terms and Conditions" />
    <PageContainer width={1024}>
      <Navigation />
      <StaticQuery
        query={graphql`
          query {
            markdownRemark(id: { eq: "c591e19c-94a0-5b0b-be4a-b42142aeffe7" }) {
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
