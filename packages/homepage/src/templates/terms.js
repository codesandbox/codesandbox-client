import React from 'react';
import { Link, graphql } from 'gatsby';
import { Content } from '../pages/legal/_elements';
import Wrapper from '../pages/legal/_wrapper';

export default ({ data }) => {
  const HTML = data.markdownRemark.html;
  return (
    <Wrapper>
      <h1>Terms of Use - Outdated</h1>
      <b>
        IMPORTANT: This version of our Terms of Use is outdated and for your
        reference only. Please refer to{' '}
        <Link to="/legal/terms">https://codesandbvox.io/legal/terms</Link> for
        the latest version.
      </b>
      <Content dangerouslySetInnerHTML={{ __html: HTML }} />
    </Wrapper>
  );
};

export const pageQuery = graphql`
  query Terms($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        version
        lastEdited
      }
    }
  }
`;
