import { format } from 'date-fns';
import { graphql } from 'gatsby';
import React from 'react';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import {
  Author,
  AuthorImage,
  Container,
  PostDate,
  Title,
} from '../components/PostElements';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import { mainStyle, Image } from './_post.elements';

export default ({
  data: {
    blogPost: {
      fields: { author, date, description, photo, title },
      frontmatter: {
        banner: { publicURL: banner },
      },
      html,
    },
  },
}) => (
  <Layout>
    <Container style={{ overflowX: 'auto' }}>
      <TitleAndMetaTags
        description={description}
        image={banner}
        title={`${title} - CodeSandbox Blog`}
      />

      <PageContainer width={800}>
        <Title>{title}</Title>

        <aside
          css={`
            align-items: center;
            display: flex;
          `}
        >
          <div
            css={`
              align-items: center;
              display: flex;
              flex: 1;
            `}
          >
            <AuthorImage alt={author} src={photo} />

            <Author>{author}</Author>
          </div>

          <PostDate>{format(date, 'MMM DD, YYYY')}</PostDate>
        </aside>

        <Image alt={title} src={banner} />

        <div css={mainStyle} dangerouslySetInnerHTML={{ __html: html }} />
      </PageContainer>
    </Container>
  </Layout>
);

export const pageQuery = graphql`
  query Post($id: String) {
    blogPost: markdownRemark(id: { eq: $id }) {
      fields {
        author
        date
        description
        photo
        slug
        title
      }
      frontmatter {
        banner {
          publicURL
        }
      }
      html
    }
  }
`;
