import { graphql, Link } from 'gatsby';
import React from 'react';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import PodcastLinks from '../components/PodcastLinks';

import TitleAndMetaTags from '../components/TitleAndMetaTags';

import { Article, Header, PostTitle } from './_post.elements';
import {
  AirDate,
  Audio,
  GuestInfo,
  InfoContainer,
  IMG,
} from './_episode.elements';

export default ({
  data: {
    episode: { frontmatter: data, html },
  },
}) => (
  <Layout>
    <Article>
      <TitleAndMetaTags
        image={data.publicURL}
        title={`${data.podcastName} - ${data.title}- CodeSandbox`}
      />

      <Header>
        <Link to="podcasts">{data.podcastName}</Link>

        <PostTitle>{data.title}</PostTitle>
        <GuestInfo>
          {/* <IMG alt={data.title} src={data.image.publicURL} /> */}
          <div
            css={`
              text-align: left;
            `}
          >
            <span
              css={`
                display: block;
                font-weight: bold;
              `}
            >
              {data.guestName}
            </span>
            <a
              href={`https://twitter.com/${data.guestTwitter}`}
              target="_blank"
              rel="noreferrer"
              css={`
                color: #757575;
                text-decoration: none;
              `}
            >
              @{data.guestTwitter}
            </a>
          </div>
        </GuestInfo>
      </Header>

      <PageContainer width={640}>
        <section
          css={`
            padding-bottom: 34px;
          `}
        >
          <AirDate>{data.airDate}</AirDate>
        </section>

        <InfoContainer dangerouslySetInnerHTML={{ __html: html }} />

        <PodcastLinks
          appleLink={data.appleLink}
          googleLink={data.googleLink}
          spotify={data.spotify}
          name={data.podcastName}
        />
      </PageContainer>
      <Audio
        title={data.title}
        src={data.audio}
        width="100%"
        height="155"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      />
    </Article>
  </Layout>
);

export const pageQuery = graphql`
  query Episode($id: String) {
    episode: markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        podcastName
        title
        airDate
        audio
        slug
        appleLink
        googleLink
        description
        episodeNumber
        spotify
        guestName
        guestTwitter
        image {
          publicURL
        }
      }
      html
    }
  }
`;
