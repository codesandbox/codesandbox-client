import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import { Header, PageTitle, PageSubtitle, Episodes } from './_elements';

import version1 from '../../assets/images/podcasts/version1.png';

const VersionOne = ({
  data: {
    allMarkdownRemark: { edges: episodes },
  },
}) => (
  <Layout>
    <PageContainer>
      <TitleAndMetaTags
        description="Level up by listening to podcasts from the best in the industry"
        title="Version One Podcast - CodeSandbox"
      />

      <Header>
        <img
          css={`
            width: 270px;
          `}
          src={version1}
          alt="Version One Podcast"
        />
        <PageTitle
          css={`
            font-size: 48px;
          `}
        >
          Version One Podcast
        </PageTitle>

        <PageSubtitle>
          Level up by listening to podcasts from the best in the industry
        </PageSubtitle>
      </Header>
      <Episodes>
        {episodes.map(({ node: { id, frontmatter } }, i) => (
          <Link
            css={`
              text-decoration: none;
            `}
            to={`podcasts/version-one/${frontmatter.slug}`}
          >
            <li
              key={id}
              css={`
                display: flex;
                margin-bottom: 40px;
              `}
            >
              <img
                css={`
                  width: 96px;
                  border-radius: 2px;
                  margin-right: 40px;
                `}
                src={frontmatter.image.publicURL}
                alt={frontmatter.title}
              />
              <section>
                <span
                  css={`
                    font-weight: bold;
                    font-size: 16px;
                    line-height: 19px;
                    display: block;
                    padding-bottom: 4px;
                    color: #999999;
                  `}
                >
                  Episode 0{frontmatter.number}
                </span>
                <span
                  css={`
                    font-weight: bold;
                    font-size: 19px;
                    line-height: 23px;

                    color: #ffffff;
                  `}
                >
                  {frontmatter.title}
                </span>
                <span
                  css={`
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    padding-top: 8px;
                    font-size: 19px;
                    line-height: 23px;

                    color: #757575;
                  `}
                >
                  {frontmatter.description}
                </span>
              </section>
            </li>
          </Link>
        ))}
      </Episodes>
    </PageContainer>
  </Layout>
);

export const query = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/podcasts/version-one/" } }
      sort: { fields: id, order: DESC }
    ) {
      edges {
        node {
          id
          frontmatter {
            description
            title
            slug
            image {
              publicURL
            }
          }
        }
      }
    }
  }
`;

export default VersionOne;
