import { format } from 'date-fns';
import { graphql, Link } from 'gatsby';
import React from 'react';

import Layout from '../components/layout';
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

// UNCOMMENT AT THE BOTTOM IF IT BREAKS
// GATSBY DOES NOT LET YOU HAVE FIELDS THAT DON'T EXIST YET

const Info = ({ authors, date, mobile, photo, ...props }) => (
  <Aside mobile={mobile} {...props}>
    <PostDate>{format(date, 'MMM DD, YYYY')}</PostDate>

    {authors.map(author => (
      <section key={author.name}>
        <AuthorImage src={photo} alt={author} />

        <Author>{author}</Author>
      </section>
    ))}
  </Aside>
);

const Blog = ({
  data: {
    allBlogPosts: { edges: blogPosts },
  },
}) => (
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

      {blogPosts.map(
        ({
          node: {
            fields: { authors, date, description, photo, slug, title },
            frontmatter: {
              banner: { publicURL: banner },
            },
            id,
          },
        }) => (
          <Wrapper key={id}>
            <Info authors={authors} date={date} photo={photo} />

            <Posts>
              {banner && (
                <Link
                  css={`
                    display: contents;
                    text-decoration: none;
                  `}
                  to={`post/${slug}`}
                >
                  <Thumbnail alt={title} src={banner} width="340" />
                </Link>
              )}

              <div>
                <Link
                  css={`
                    text-decoration: none;
                  `}
                  to={`post/${slug}`}
                >
                  <Title>{title}</Title>
                </Link>

                <Subtitle>{description}</Subtitle>
              </div>

              <Info authors={authors} date={date} mobile photo={photo} />
            </Posts>
          </Wrapper>
        )
      )}
    </PageContainer>
  </Layout>
);

export const query = graphql`
  {
    allBlogPosts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/articles/" } }
      sort: { fields: [fields___date], order: [DESC] }
    ) {
      edges {
        node {
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
          id
        }
      }
    }
  }
`;

export default Blog;
