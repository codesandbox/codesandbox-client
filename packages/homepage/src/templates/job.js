import { graphql, Link } from 'gatsby';
import React from 'react';

import { ThemeProvider } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import {
  ApplyButton,
  ContentBlock,
  Title,
  BackButton,
  Aside,
  Grid,
  MobileAside,
} from './_job.elements';

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

      <PageContainer width={1024}>
        <Grid>
          <div>
            <BackButton autoWidth as={Link} to="/jobs">
              ← Back to Careers
            </BackButton>

            <Title>{title}</Title>

            <ContentBlock dangerouslySetInnerHTML={{ __html: html }} />
            <MobileAside>
              <ContentBlock>
                <h2> Interested?</h2>
                <p>
                  Please send us your recent work or GitHub projects that you’re
                  proud of, or open source contributions.
                </p>
                <ApplyButton href={applyLink} target="_blank">
                  Apply now
                </ApplyButton>
              </ContentBlock>
            </MobileAside>
          </div>
          <Aside>
            <ContentBlock>
              <h2> Interested?</h2>
              <p>
                Please send us your recent work or GitHub projects that you’re
                proud of, or open source contributions.
              </p>
              <ApplyButton href={applyLink} target="_blank">
                Apply now
              </ApplyButton>
            </ContentBlock>
          </Aside>
        </Grid>
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
