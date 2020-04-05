import { format } from 'date-fns';
import { graphql } from 'gatsby';
import React from 'react';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import {
  Posts,
  Postitle,
  Post,
  Thumbnail,
  Aside,
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
        description="All the details about the latest CodeSandbox updates"
        title="Changelog - CodeSandbox"
      />

      <Header>
        <PageTitle>What’s New</PageTitle>

        <PageSubtitle>
          All the details about the latest CodeSandbox updates.
        </PageSubtitle>
      </Header>

      {blogPosts.map(
        ({
          node: {
            fields: { date, title },
            frontmatter: {
              banner: { publicURL: banner },
            },
            html,
            id,
          },
        }) => (
          <Posts key={id}>
            <Aside>Released on {format(date, 'MMMM / DD / YYYY')}</Aside>

            <Thumbnail alt={title} src={banner} />
            <Postitle>{title} </Postitle>
            <Post dangerouslySetInnerHTML={{ __html: html }} />
          </Posts>
        )
      )}
    </PageContainer>
  </Layout>
);

export const query = graphql`
  {
    allBlogPosts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//changelog/" } }
      sort: { fields: [frontmatter___date], order: [DESC] }
    ) {
      edges {
        node {
          fields {
            title
            date
          }
          frontmatter {
            banner {
              publicURL
            }
            date
          }
          id
          html
        }
      }
    }
  }
`;

export default Blog;
