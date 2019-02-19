import { graphql } from 'gatsby';

export const TERMS = graphql`
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

export const PRIVACY = graphql`
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
