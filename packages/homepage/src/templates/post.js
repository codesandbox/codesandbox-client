import React from 'react';
import styled, { css } from 'styled-components';
import { graphql } from 'gatsby';
import { format } from 'date-fns';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';

const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Poppins';
  font-weight: 600;
  font-size: 30px;
  line-height: 1.5;

  color: #f2f2f2;
`;

export const Date = styled.span`
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 12px;
  color: #b8b9ba;
  display: block;
`;

export const AuthorImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

export const Author = styled.h4`
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 18px;
  margin: 0;
  margin-left: 16px;

  color: #f2f2f2;
`;

const mainStyle = css`
  margin: auto;
  color: white;
  overflow: hidden;
  line-height: 1.5;

  font-weight: 500;
  font-size: 18px;

  color: #fff;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Poppins';
  }

  p,
  li {
    font-family: 'Open Sans';
  }

  img {
    display: block;
    margin: 20px auto;
  }
`;

export default ({ data: { feedMediumBlog, markdownRemark } }) => {
  const ives = 'https://avatars2.githubusercontent.com/u/587016?s=60&v=4';
  const { creator, title, content, isoDate } = feedMediumBlog || {};
  console.log(markdownRemark, feedMediumBlog);
  return (
    <Layout>
      <Container style={{ overflowX: 'auto' }}>
        <TitleAndMetaTags
          title={`${title} - CodeSandbox Documentation`}
          // description={frontmatter.description}
        />
        <PageContainer width={800}>
          <Title>{title}</Title>
          <aside>
            <Date>{format(isoDate, 'MMM DD,YYYY')}</Date>
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <AuthorImage src={ives} alt={creator} />
              <Author>{creator}</Author>
            </div>
          </aside>
          <div
            css={mainStyle}
            dangerouslySetInnerHTML={{
              __html: content.encoded,
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
        slug
        authors
        photo
        title
      }
    }
  }
`;
