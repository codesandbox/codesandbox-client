import React from 'react';
import { graphql, Link } from 'gatsby';
import { Button } from '@codesandbox/common/lib/components/Button';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';

import {
  PageTitle,
  PageSubtitle,
  Job,
  Jobs,
  OtherJobs,
} from './_jobs.elements';

import Layout from '../components/layout';

const Careers = ({ data: { allMarkdownRemark } }) => {
  const jobs = allMarkdownRemark.edges;

  return (
    <Layout>
      <PageContainer width={600}>
        <TitleAndMetaTags
          description="Here you can all Careers we have available for you at CodeSandbox"
          title="Careers - CodeSandbox"
        />
        <PageTitle>Join the team</PageTitle>
        <PageSubtitle>
          We’re building a better developer tool for the digital age. [Something
          about community focus and remote working]. [Also we’re an awesome
          company etc. etc.]
        </PageSubtitle>
        <PageTitle as="h2">Job Openings</PageTitle>
        {jobs.map(({ node: job }) => (
          <Jobs key={job.id}>
            <Job>
              {job.frontmatter.title}
              <Button small as={Link} to={`/job/${job.frontmatter.slug}`}>
                Learn more
              </Button>
            </Job>
          </Jobs>
        ))};
        <PageSubtitle
          css={`
            margin-bottom: 0;
          `}
        >
          Don't see a position that fits your skill set?
        </PageSubtitle>
        <OtherJobs>
          <p
            css={`
              max-width: 70%;
            `}
          >
            We are always looking for talented, hard working people. Tell us
            what you love to do!
          </p>
          <Button
            css={`
              font-size: 14px;
              line-height: 1;
            `}
            href={'mailto:hello@codesandbox.io'}
            small
            secondary
            target="_blank"
          >
            contact us
          </Button>
        </OtherJobs>
      </PageContainer>
    </Layout>
  );
};

export const query = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/jobs/" } }
      limit: 1000
    ) {
      edges {
        node {
          id
          frontmatter {
            slug
            title
          }
        }
      }
    }
  }
`;

export default Careers;
