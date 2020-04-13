import { format } from 'date-fns';
import { graphql, Link } from 'gatsby';

import React from 'react';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import {
  Posts,
  Subtitle,
  Grid,
  Wrapper,
  CardContent,
  Thumbnail,
  Title,
  PublishDate,
  Header,
  PageTitle,
  PageSubtitle,
} from './_elements';

const Blog = ({
  data: {
    allBlogPosts: { edges: blogPosts },
  },
}) => (
  <Layout>
    <PageContainer>
      <TitleAndMetaTags
        description="Here you can find articles written by the team and external contributors"
        title="Blog - CodeSandbox"
      />

      <Header>
        <PageTitle>CodeSandbox Blog</PageTitle>

        <PageSubtitle>
          Read all about new releases, tips, tricks and how CodeSandbox is build
        </PageSubtitle>
      </Header>

      <Grid>
        {blogPosts.map(
          ({
            node: {
              fields: { date, description, slug, title },
              frontmatter: {
                banner: { publicURL: banner },
              },
              id,
            },
          }) => (
            <Wrapper key={id} width={765}>
              <Posts>
                <Link
                  css={`
                    text-decoration: none;
                  `}
                  to={`post/${slug}`}
                >
                  <Thumbnail src={banner} />

                  <CardContent>
                    <Title>{title}</Title>
                    <PublishDate>{format(date, 'MMM / DD / YYYY')}</PublishDate>
                    <Subtitle>{description}</Subtitle>
                  </CardContent>
                </Link>
              </Posts>
            </Wrapper>
          )
        )}
      </Grid>
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
