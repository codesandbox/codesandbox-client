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
          {
            allMarkdownRemark(
              filter: { fileAbsolutePath: { regex: "/legal/terms.md/" } }
            ) {
              edges {
                node {
                  html
                }
              }
            }
          }
        `}
        render={({ allMarkdownRemark: { edges } }) => (
          <Content dangerouslySetInnerHTML={{ __html: edges[0].node.html }} />
        )}
      />
    </PageContainer>
  </Layout>
);
