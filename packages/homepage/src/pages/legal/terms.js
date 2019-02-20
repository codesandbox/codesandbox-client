import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Content } from './_elements';
import Wrapper from './_wrapper';

const TERMS = graphql`
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
`;

export default () => (
  <Wrapper>
    <StaticQuery
      query={TERMS}
      render={({ allMarkdownRemark: { edges } }) => (
        <Content dangerouslySetInnerHTML={{ __html: edges[0].node.html }} />
      )}
    />
  </Wrapper>
);
