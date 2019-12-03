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

import {
  AuthorContainer,
  Image,
  MetaData,
  PostContainer,
} from './_post.elements';

export default ({
  data: {
    blogPost: {
      fields: { authors, date, description, photo, title },
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

        <MetaData>
          <div style={{ flex: 1 }}>
            {authors.map(author => (
              <AuthorContainer key={author}>
                {authors.length === 1 && (
                  <AuthorImage alt={author} src={photo} />
                )}

                <Author>{author}</Author>
              </AuthorContainer>
            ))}
          </div>

          <PostDate>{format(date, 'MMM DD, YYYY')}</PostDate>
        </MetaData>

        <Image alt={title} src={banner} />

        <PostContainer dangerouslySetInnerHTML={{ __html: html }} />
      </PageContainer>
    </Container>
  </Layout>
);

export const pageQuery = graphql`
  query Post($id: String) {
    blogPost: markdownRemark(id: { eq: $id }) {
      fields {
        authors
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
