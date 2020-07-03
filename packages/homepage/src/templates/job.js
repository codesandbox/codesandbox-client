import { graphql, Link } from 'gatsby';
import React from 'react';

import { Button, ThemeProvider } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import { ApplyButton, ContentBlock, Title } from './_job.elements';

export default ({
  data: {
    job: {
      fields: { applyLink, title },
      html,
    },
  },
}) => (
  <Layout>
    <ThemeProvider theme={codesandboxBlack}>
      <TitleAndMetaTags title={`${title} - CodeSandbox Careers`} />

      <PageContainer width={800}>
        <Button autoWidth as={Link} to="/jobs">
          See all jobs
        </Button>

        <Title>{title}</Title>

        <ContentBlock dangerouslySetInnerHTML={{ __html: html }} />

        <ContentBlock>
          <h2>Applying</h2>

          <p>
            Not sure you meet 100% of our qualifications? Please apply anyway!
          </p>
        </ContentBlock>

        <ApplyButton href={applyLink} autoWidth target="_blank">
          Apply now
        </ApplyButton>
      </PageContainer>
    </ThemeProvider>
  </Layout>
);

export const pageQuery = graphql`
  query Job($id: String) {
    job: markdownRemark(id: { eq: $id }) {
      fields {
        applyLink
        title
      }
      html
    }
  }
`;
