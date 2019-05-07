import React from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';
import { graphql, Link } from 'gatsby';
import styled, { css } from 'styled-components';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';

export const Title = styled.h1`
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  font-size: 36px;
  margin-bottom: 2em;
  margin-top: 1em;
  padding-bottom: 0;
  color: ${props => props.theme.lightText};
`;

const styles = css`
  h2 {
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    margin-top: 36px;
    color: ${props => props.theme.lightText};
  }

  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.5;
  color: ${props => props.theme.lightText};
  margin-bottom: 36px;
`;

export default ({ data: { markdownRemark: job } }) => (
  <Layout>
    <TitleAndMetaTags
      title={`${job.frontmatter.title} - CodeSandbox Careers`}
    />
    <PageContainer width={800}>
      <Button small as={Link} to={`/jobs`}>
        See all jobs
      </Button>
      <Title>{job.frontmatter.title}</Title>
      <div
        css={styles}
        dangerouslySetInnerHTML={{
          __html: job.html,
        }}
      />
      <div css={styles}>
        <h2>Applying</h2>
        <p>
          Not sure you meet 100% of our qualifications? Please apply anyway!
        </p>
      </div>
      <Button
        css={`
          font-size: 14px;
          line-height: 1;
          margin-bottom: 50px;
          display: inline-block;
        `}
        href={job.frontmatter.link}
        small
        target="_blank"
      >
        Apply now
      </Button>
    </PageContainer>
  </Layout>
);

export const pageQuery = graphql`
  query Job($id: String) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        link
      }
    }
  }
`;
