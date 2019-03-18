import React from 'react';
import { graphql, Link } from 'gatsby';
import { format } from 'date-fns';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';

import {
  Posts,
  Date,
  Subtitle,
  Title,
  Thumbnail,
  Wrapper,
  Author,
  AuthorImage,
} from './_blog.elements';
import Layout from '../components/layout';

const getContents = str => {
  const elem = document.createElement('div');
  elem.style.display = 'none';
  document.body.appendChild(elem);
  elem.innerHTML = str;
  const data = {
    src: elem.querySelector('img').src,
    subtitle: elem.querySelector('p').innerText,
  };
  elem.remove();
  return data;
};

const Blog = ({ data: { allFeedMediumBlog } }) => {
  const posts = allFeedMediumBlog.edges.filter(post => post.node.categories);
  return (
    <Layout>
      <PageContainer width={1440}>
        <TitleAndMetaTags
          description="Here you can find articles written by the team and external contributors"
          title="Blog - CodeSandbox"
        />
        {posts.map(post => {
          const { src, subtitle } = getContents(post.node.content.encoded);
          const ives =
            'https://avatars2.githubusercontent.com/u/587016?s=60&v=4';
          const slug = post.node.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
          return (
            <Wrapper>
              <aside>
                <Date>{format(post.node.isoDate, 'MMM DD,YYYY')}</Date>
                <div
                  css={`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <AuthorImage src={ives} alt={post.node.creator} />
                  <Author>{post.node.creator}</Author>
                </div>
              </aside>
              <Posts key={post.node.id}>
                <Thumbnail src={src} width="340" alt={post.node.title} />
                <div>
                  <Link
                    css={`
                      text-decoration: none;
                    `}
                    to={`post/${slug}`}
                  >
                    <Title>{post.node.title}</Title>
                  </Link>
                  <Subtitle>{subtitle}</Subtitle>
                </div>
              </Posts>
            </Wrapper>
          );
        })};
      </PageContainer>
    </Layout>
  );
};

export const query = graphql`
  {
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
