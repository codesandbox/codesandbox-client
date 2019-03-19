import React from 'react';
import { graphql, Link } from 'gatsby';
import { format } from 'date-fns';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';

import {
  Posts,
  PostDate,
  Subtitle,
  Title,
  Thumbnail,
  Wrapper,
  Author,
  AuthorImage,
} from './_blog.elements';
import Layout from '../components/layout';
import { makeFeed } from '../utils/makePosts';

const Blog = ({ data: { allFeedMediumBlog, allMarkdownRemark } }) => {
  const posts = makeFeed(allFeedMediumBlog, allMarkdownRemark);
  return (
    <Layout>
      <PageContainer width={1440}>
        <TitleAndMetaTags
          description="Here you can find articles written by the team and external contributors"
          title="Blog - CodeSandbox"
        />
        {posts.map(post => (
          <Wrapper key={post.id}>
            <aside>
              <PostDate>{format(post.date, 'MMM DD,YYYY')}</PostDate>
              <div
                css={`
                  display: flex;
                  align-items: center;
                `}
              >
                <AuthorImage src={post.photo} alt={post.creator} />
                <Author>{post.creator}</Author>
              </div>
            </aside>
            <Posts key={post.id}>
              <Thumbnail src={post.src} width="340" alt={post.title} />
              <div>
                <Link
                  css={`
                    text-decoration: none;
                  `}
                  to={`post/${post.slug}`}
                >
                  <Title>{post.title}</Title>
                </Link>
                <Subtitle>{post.subtitle}</Subtitle>
              </div>
            </Posts>
          </Wrapper>
        ))};
      </PageContainer>
    </Layout>
  );
};

export const query = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/articles/" } }
      limit: 1000
    ) {
      edges {
        node {
          id
          html
          frontmatter {
            featuredImage
            slug
            authors
            photo
            title
            description
            date
          }
        }
      }
    }
    allFeedMediumBlog {
      edges {
        node {
          id
          categories
          creator
          title
          isoDate
          content {
            encoded
          }
        }
      }
    }
  }
`;

export default Blog;
