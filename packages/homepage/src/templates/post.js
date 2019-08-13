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
import { makePost } from '../utils/makePosts';

import { mainStyle, Image } from './_post.elements';

export default ({ data: { markdownRemark } }) => {
  const {
    creator,
    title,
    content,
    date,
    photo,
    featuredImage,
    description,
  } = makePost(markdownRemark);

  const featuredImageUrl = (featuredImage || '').includes('http')
    ? featuredImage
    : `https://codesandbox.io${featuredImage}`;
  return (
    <Layout>
      <Container style={{ overflowX: 'auto' }}>
        <TitleAndMetaTags
          description={description}
          image={featuredImageUrl}
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
              <AuthorImage src={photo} alt={creator} />

              <Author>{creator}</Author>
            </div>

            <PostDate>{format(date, 'MMM DD, YYYY')}</PostDate>
          </aside>

          {featuredImage ? <Image alt={title} src={featuredImage} /> : null}

          <div
            css={mainStyle}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </PageContainer>
      </Container>
    </Layout>
  );
};

export const pageQuery = graphql`
  query Post($id: String) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        featuredImage {
          publicURL
        }
        slug
        authors
        photo
        title
        description
        date
      }
    }
  }
`;
