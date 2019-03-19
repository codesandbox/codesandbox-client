import React from 'react';

import { graphql } from 'gatsby';
import { format } from 'date-fns';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import {
  Container,
  Title,
  Date,
  AuthorImage,
  Author,
  mainStyle,
  Image,
} from './_post.elements';

const makeContent = (markdown, medium) => {
  if (medium) {
    return {
      ...medium,
      photo: 'https://avatars2.githubusercontent.com/u/587016?s=60&v=4',
      content: medium.content.encoded,
      date: medium.isoDate,
    };
  }

  return {
    ...markdown.frontmatter,
    content: markdown.html,
    creator: markdown.frontmatter.authors[0],
  };
};

export default ({ data: { feedMediumBlog, markdownRemark } }) => {
  const { creator, title, content, date, photo, featuredImage } = makeContent(
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
            <Date>{format(date, 'MMM DD,YYYY')}</Date>
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
    markdownRemark(id: { eq: $id }) {
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
`;
