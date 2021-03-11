import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import {
  Header,
  PageTitle,
  PageSubtitle,
  Episodes,
  EpisodeNumber,
} from './_elements';

import version1 from '../../assets/images/podcasts/version1.png';
import allPodcasts from '../../../content/podcasts/info';
import PodcastLinks from '../../components/PodcastLinks';

const info = allPodcasts.find(podcast => podcast.slug === 'version-one');

const VersionOne = ({
  data: {
    allMarkdownRemark: { edges: episodes },
  },
}) => (
  <Layout>
    <PageContainer>
      <TitleAndMetaTags
        description={info.description}
        title="Version One Podcast - CodeSandbox"
      />

      <Header>
        <img
          css={`
            width: 270px;
          `}
          src={version1}
          alt={info.name}
        />
        <PageTitle
          css={`
            font-size: 48px;
          `}
        >
          {info.name} Podcast
        </PageTitle>

        <PageSubtitle>{info.description}</PageSubtitle>
      </Header>
      <Episodes>
        {episodes.map(({ node: { id, frontmatter } }) => (
          <Link
            css={`
              text-decoration: none;
            `}
            key={id}
            to={`podcasts/version-one/${frontmatter.slug}`}
          >
            <li
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

                  @media screen and (max-width: 768px) {
                    display: none;
                  }
                `}
                src={frontmatter.image.publicURL}
                alt={frontmatter.title}
              />
              <section>
                <EpisodeNumber>
                  Episode 0{frontmatter.episodeNumber}
                </EpisodeNumber>
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
      <PodcastLinks
        appleLink={info.links.apple}
        googleLink={info.links.google}
        spotify={info.links.spotify}
        name={info.name}
      />
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
            episodeNumber
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
