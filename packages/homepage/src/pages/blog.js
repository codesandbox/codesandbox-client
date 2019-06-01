import { format } from 'date-fns';
import { graphql, Link } from 'gatsby';
import React from 'react';

import PageContainer from '../components/PageContainer';
import {
  Author,
  AuthorImage,
  PostDate,
  Title,
} from '../components/PostElements';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import {
  Posts,
  Subtitle,
  Thumbnail,
  Wrapper,
  Aside,
  Header,
  PageTitle,
  PageSubtitle,
} from './_blog.elements';

import Layout from '../components/layout';
import { makeFeed } from '../utils/makePosts';

// UNCOMMENT AT THE BOTTOM IF IT BREAKS
// GATSBY DOES NOT LET YOU HAVE FIELDS THAT DON'T EXIST YET

const Info = ({ mobile, post: { creator, date, photo }, ...props }) => (
  <Aside mobile={mobile} {...props}>
    <PostDate>{format(date, 'MMM DD, YYYY')}</PostDate>

    <section>
      <AuthorImage src={photo} alt={creator} />

      <Author>{creator}</Author>
    </section>
  </Aside>
);

const Blog = ({ data: { allMarkdownRemark } }) => {
  const posts = makeFeed(allMarkdownRemark);

  return (
    <Layout>
      <PageContainer width={1440}>
        <TitleAndMetaTags
          description="Here you can find articles written by the team and external contributors"
          title="Blog - CodeSandbox"
        />

        <Header>
          <PageTitle>Blog</PageTitle>

          <PageSubtitle>
            Welcome to the CodeSandbox blog. Here you can find posts about new
            releases, tips and tricks and how we made CodeSandbox.
          </PageSubtitle>
        </Header>

        {posts.map(post => (
          <Wrapper key={post.id}>
            <Info post={post} />

            <Posts>
              {post.src && (
                <Link
                  css={`
                    display: contents;
                    text-decoration: none;
                  `}
                  to={`post/${post.slug}`}
                >
                  <Thumbnail alt={post.title} src={post.src} width="340" />
                </Link>
              )}

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
        ))}
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
    }
  }
`;

export default Blog;
