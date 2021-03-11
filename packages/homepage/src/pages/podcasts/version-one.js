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
  Episode,
  Description,
  EpisodeTitle,
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
            <Episode>
              <img src={frontmatter.image.publicURL} alt={frontmatter.title} />
              <section>
                <EpisodeNumber>
                  Episode 0{frontmatter.episodeNumber}
                </EpisodeNumber>
                <EpisodeTitle>{frontmatter.title}</EpisodeTitle>
                <Description>{frontmatter.description}</Description>
              </section>
            </Episode>
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
