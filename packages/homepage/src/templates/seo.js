import { graphql } from 'gatsby';
import React from 'react';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import {
  Article,
  Header,
  PostTitle,
  // Image,
  PostContainer,
} from './_post.elements';

export default ({
  data: {
    blogPost: {
      frontmatter: {
        description,
        title,
        banner: { publicURL: banner },
      },
      html,
    },
  },
}) => (
  <Layout>
    <Article>
      <TitleAndMetaTags
        description={description}
        image={banner}
        title={`${title} - CodeSandbox`}
      />

      <Header>
        <PostTitle>{title}</PostTitle>
      </Header>

      {/* TODO: Missing the artwork
      {banner && <Image alt={title} src={banner} />} */}

      <PageContainer width={768}>
        <PostContainer dangerouslySetInnerHTML={{ __html: html }} />
      </PageContainer>
    </Article>
  </Layout>
);

export const pageQuery = graphql`
  query SeoPages($id: String) {
    blogPost: markdownRemark(id: { eq: $id }) {
      fields {
        slug
        title
      }
      frontmatter {
        banner {
          publicURL
        }
        title
        description
      }
      html
    }
  }
`;
