import React from 'react';
import { Content } from '../pages/legal/_elements';
import Wrapper from '../pages/legal/_wrapper';

export default ({ data }) => {
  const HTML = data.markdownRemark.html;
  return (
    <Wrapper>
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
