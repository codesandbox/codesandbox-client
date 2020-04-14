import { format } from 'date-fns';
import { graphql, Link } from 'gatsby';
import React from 'react';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import { AuthorImage } from '../components/PostElements';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import {
  Article,
  Header,
  PostTitle,
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
    <Article>
      <TitleAndMetaTags
        description={description}
        image={banner}
        title={`${title} - CodeSandbox Blog`}
      />

      <Header>
        <Link to="blog">CodeSandbox Blog</Link>

        <PostTitle>{title}</PostTitle>

        <MetaData>
          {authors.map(author => (
            <AuthorContainer key={author}>
              {authors.length === 1 && <AuthorImage alt={author} src={photo} />}

              <h4>{author}</h4>
              <date>{format(date, 'MMM / DD / YYYY')}</date>
            </AuthorContainer>
          ))}
        </MetaData>
      </Header>

      <Image alt={title} src={banner} />

      <PageContainer width={768}>
        <PostContainer dangerouslySetInnerHTML={{ __html: html }} />
      </PageContainer>
    </Article>
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
