import React from 'react';
import { StaticQuery } from 'gatsby';
import { Content } from './_elements';
import { PRIVACY } from './_queries';
import Wrapper from './_wrapper';

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
