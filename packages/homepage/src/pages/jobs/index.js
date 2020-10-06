import { graphql, Link } from 'gatsby';
import React from 'react';

import { ThemeProvider } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import imageOne from '../../assets/images/jobs/one.png';
import imageTwo from '../../assets/images/jobs/two.png';
import imageThree from '../../assets/images/jobs/three.png';
import imageFour from '../../assets/images/jobs/four.png';

import {
  PageTitle,
  PageSubtitle,
  TitleDescription,
  Job,
  Jobs,
  ImageGallery,
  HeroSection,
} from './_elements';

const Careers = ({
  data: {
    allJobs: { edges: jobs },
  },
}) => (
  <Layout>
    <ThemeProvider theme={codesandboxBlack}>
      <PageContainer width={800}>
        <TitleAndMetaTags
          description="Find out here about careers and working at CodeSandbox!"
          title="Careers - CodeSandbox"
        />

        <PageTitle>Join CodeSandbox</PageTitle>
        <HeroSection>
          <TitleDescription>
            CodeSandbox provides free, instant, collaborative sandboxes for
            rapid web development. Founded in 2017, we’ve raised more than $15M
            from top-tier VCs and prominent industry figures, including EQT
            Ventures, Kleiner Perkins, Christian Bach & Mathias Biilmann
            (Netlify), and Dylan Field (Figma).
            <br />
            <br />
            Used by over two million developers each month, including within
            organizations like Shopify, Atlassian, and Stripe, creators have
            crafted over 10M apps on the platform since launch. It’s used by
            thousands of open source projects, including React, Vue, and Babel,
            among others.
            <br />
            <br />
            We’re making it easier for everyone to create things with code.
            We’re removing the hassle of setting up a development environment,
            installing tooling, and sharing your project with others. Join us at
            CodeSandbox and help build the future of coding on the web.
          </TitleDescription>
          <div>
            The Perks:
            <ul
              css={`
                margin: 0;
                margin-top: 8px;
                padding: 0;
                list-style: none;
                li {
                  span {
                    color: #2286f7;
                  }
                }
              `}
            >
              <li>
                <span>✓</span> Remote-first
              </li>
              <li>
                <span>✓</span> Flexible hours
              </li>
              <li>
                <span>✓</span> Unlimited vacation
              </li>
              <li>
                <span>✓</span> Choose your own equipment
              </li>
              <li>
                <span>✓</span> Generous parental leave
              </li>
            </ul>
          </div>
        </HeroSection>
        <ImageGallery>
          <section>
            <img src={imageOne} alt="Office" />
            <img src={imageTwo} alt="Office" />
          </section>
          <img src={imageThree} alt="Amsterdam" />
          <img src={imageFour} alt="Office" />
        </ImageGallery>
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <PageTitle>Our Values</PageTitle>
          <TitleDescription
            css={`
              width: 640px;
              max-width: 80%;
            `}
          >
            Everything we do at CodeSandbox derives from our values. The product
            we create is a reflection of how we work together as a team. That’s
            why our values are the same, both inside and out.
            <br />
            <br />
            We’re building a team, tool, and community that’s:
            <br />
            <br />
            <strong>Accessible</strong> - we’re making development accessible to
            all, building a reality where everyone can be a creator.
            <br />
            <br />
            <strong>Collaborative</strong> - providing people with the means to
            encourage and help each other.
            <br />
            <br />
            <strong>Empowering</strong> - enabling creators to feel like they
            can build without limits.
          </TitleDescription>
        </div>
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <PageTitle>How we work</PageTitle>
          <TitleDescription
            css={`
              width: 640px;
              max-width: 80%;
            `}
          >
            We follow a peer-led development approach built around autonomous
            teams. These teams form to create a feature or complete a project
            from start to finish. We ideate, scope, and implement—we’re not code
            monkeys or pixel pushers, but creative professionals who use our
            full range of skills to get things done.
            <br />
            <br />
            With advice from peers, a clear strategy, and a supportive culture,
            it’s still challenging work that can push us out of our comfort
            zones. Ultimately though, we find it more fulfilling and delivers
            better results than other approaches.
          </TitleDescription>
        </div>
        <PageSubtitle>Open Positions</PageSubtitle>

        {jobs.map(({ node: { fields: { slug, title }, id } }) => (
          <Jobs key={id}>
            <Link
              to={`/job/${slug}`}
              css={`
                text-decoration: none;
              `}
            >
              <Job>
                <span
                  css={`
                    font-weight: bold;
                  `}
                >
                  {title}
                </span>

                <span
                  css={`
                    color: #757575;
                  `}
                >
                  Remote (EU timezones)
                </span>
              </Job>
            </Link>
          </Jobs>
        ))}
      </PageContainer>
    </ThemeProvider>
  </Layout>
);

export const query = graphql`
  {
    allJobs: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/jobs/" } }
    ) {
      edges {
        node {
          fields {
            slug
            title
          }
          id
        }
      }
    }
  }
`;

export default Careers;
