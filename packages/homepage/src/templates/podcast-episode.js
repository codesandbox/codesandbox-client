import { graphql, Link } from 'gatsby';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default ({ data: { episode } }) => {
  const [open, setOpen] = useState(false);
  const info = episode.edges.find(edge => edge.node.frontmatter.slug).node;
  const transcript = episode.edges.find(edge => !edge.node.frontmatter.slug)
    .node;
  const { frontmatter: data, html } = info;

  return (
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

          <button type="button" onClick={() => setOpen(o => !o)}>
            Show Full Transcript
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                style={{ overflow: 'hidden' }}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 1 }}
              >
                <InfoContainer
                  dangerouslySetInnerHTML={{ __html: transcript.html }}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
};

export const pageQuery = graphql`
  query Episode($ids: [String]) {
    episode: allMarkdownRemark(filter: { id: { in: $ids } }) {
      edges {
        node {
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
    }
  }
`;
