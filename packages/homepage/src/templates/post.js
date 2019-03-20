import React from 'react';

import { graphql } from 'gatsby';
import { format } from 'date-fns';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import { mainStyle, Image } from './_post.elements';

import {
  Container,
  Title,
  PostDate,
  AuthorImage,
  Author,
} from '../components/PostElements';
import { makePost } from '../utils/makePosts';

// UNCOMMENT AT THE BOTTOM IF IT BREAKS
// GATSBY DOES NOT LET YOU HAVE FIELDS THAT DON'T EXIST YET

export default ({ data: { feedMediumBlog, markdownRemark } }) => {
  const { creator, title, content, date, photo, featuredImage } = makePost(
    markdownRemark,
    feedMediumBlog
  );
  return (
    <Layout>
      <Container style={{ overflowX: 'auto' }}>
        <TitleAndMetaTags title={`${title} - CodeSandbox Blog`} />
        <PageContainer width={800}>
          <Title>{title}</Title>
          <aside>
            <PostDate>{format(date, 'MMM DD,YYYY')}</PostDate>
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <AuthorImage src={photo} alt={creator} />
              <Author>{creator}</Author>
            </div>
          </aside>
          {featuredImage ? <Image src={featuredImage} alt={title} /> : null}
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
    feedMediumBlog(id: { eq: $id }) {
      id
      categories
      creator
      link
      title
      pubDate
      isoDate
      content {
        encoded
      }
    }
    # UNCOMMENT ME
    # markdownRemark(id: { eq: $id }) {
    #   html
    # frontmatter {
    #   featuredImage
    #   slug
    #   authors
    #   photo
    #   title
    #   description
    #   date
    # }
    # }
  }
`;
