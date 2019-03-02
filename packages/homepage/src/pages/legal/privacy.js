import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Content } from './_elements';
import Wrapper from './_wrapper';

const PRIVACY = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/legal/policy.md/" } }
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
      query={PRIVACY}
      render={({ allMarkdownRemark: { edges } }) => (
        <Content dangerouslySetInnerHTML={{ __html: edges[0].node.html }} />
      )}
    />
  </Wrapper>
);
