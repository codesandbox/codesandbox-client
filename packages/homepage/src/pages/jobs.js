import React from 'react';
import { graphql, Link } from 'gatsby';
import { Button } from '@codesandbox/common/lib/components/Button';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';

import {
  PageTitle,
  PageSubtitle,
  TitleDescription,
  Job,
  Jobs,
  OtherJobs,
} from './_jobs.elements';

import Layout from '../components/layout';

const Careers = ({ data: { allMarkdownRemark } }) => {
  const jobs = allMarkdownRemark.edges;

  return (
    <Layout>
      <PageContainer width={800}>
        <TitleAndMetaTags
          description="Find out here about careers and working at CodeSandbox!"
          title="Careers - CodeSandbox"
        />
        <PageTitle>Join the team</PageTitle>
        <TitleDescription>
          CodeSandbox is a company that aims to make it easy for everyone to
          create applications. We want to cut away the hassle of setting up the
          environment, installing the tooling and sharing your project with
          others. We are specifically focused on lowering the barrier to entry
          of web development and want to make creating applications both easier
          and faster.
          <br />
          <br />
          Do you resonate with this goal? Then CodeSandbox is the right place
          for you! At CodeSandbox you have the chance to work on development
          tooling that’s used by more than a million people on a monthly basis.
          You’ll get the chance to be part of the founding team and will have a
          big impact on how the online development tooling will be shaped in the
          future. We’re also an open source company, the majority of our work is
          in the open and the community is a big part of us.
          <br />
          <br />
          Our team is remote-first, you can work from wherever you’d like. Our
          current team is distributed across The Netherlands, Romania and
          Germany.
          <br />
          <br />
          We’re looking forward to meeting you!
        </TitleDescription>
        <PageSubtitle>Job Openings</PageSubtitle>
        {jobs.map(({ node: job }) => (
          <Jobs key={job.id}>
            <Job>
              {job.frontmatter.title}
              <Button small as={Link} to={`/job/${job.frontmatter.slug}`}>
                Learn more
              </Button>
            </Job>
          </Jobs>
        ))}
        <TitleDescription
          css={`
            margin-bottom: 0;
          `}
        >
          Don't see a position that fits your skill set?
        </TitleDescription>
        <OtherJobs>
          <p>
            We are always looking for talented, hard working people. Drop us a
            line and show us your work
          </p>
          <Button
            css={`
              font-size: 14px;
              line-height: 1;
              min-width: 110px;
            `}
            href={'mailto:careers@codesandbox.io'}
            small
            secondary
            target="_blank"
          >
            Contact Us
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
