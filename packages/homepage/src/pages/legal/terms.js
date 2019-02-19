import React from 'react';
import { StaticQuery } from 'gatsby';
import { Content } from './_elements';
import Wrapper from './_wrapper';
import { TERMS } from './_queries';

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
