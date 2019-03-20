import React from 'react';
import { graphql, Link } from 'gatsby';
import { format } from 'date-fns';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';

import {
  Title,
  PostDate,
  AuthorImage,
  Author,
} from '../components/PostElements';

import { Posts, Subtitle, Thumbnail, Wrapper, Aside } from './_blog.elements';

import Layout from '../components/layout';
import { makeFeed } from '../utils/makePosts';

// UNCOMMENT AT THE BOTTOM IF IT BREAKS
// GATSBY DOES NOT LET YOU HAVE FIELDS THAT DON'T EXIST YET

const Info = ({ post, mobile, ...props }) => (
  <Aside mobile={mobile} {...props}>
    <PostDate>{format(post.date, 'MMM DD,YYYY')}</PostDate>
    <section>
      <AuthorImage src={post.photo} alt={post.creator} />
      <Author>{post.creator}</Author>
    </section>
  </Aside>
);

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
            <Info post={post} />
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
              <Info post={post} mobile />
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
          # UNCOMMENT ME
          # frontmatter {
          #   featuredImage
          #   slug
          #   authors
          #   photo
          #   title
          #   description
          #   date
          # }
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
