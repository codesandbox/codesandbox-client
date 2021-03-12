import { graphql, Link } from 'gatsby';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import PodcastLinks from '../components/PodcastLinks';

import TitleAndMetaTags from '../components/TitleAndMetaTags';

import { Article, Header, PostTitle } from './_post.elements';
import {
  Audio,
  GuestInfo,
  InfoContainer,
  TranscriptButton,
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
          meta={[
            { name: 'robots', content: 'noindex' },
            { name: 'googlebot', content: 'noindex' },
          ]}
        />

        <Header>
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
                {data.airDate}
              </span>
            </div>
          </GuestInfo>
        </Header>

        <PageContainer width={640}>
          <InfoContainer dangerouslySetInnerHTML={{ __html: html }} />

          <TranscriptButton type="button" onClick={() => setOpen(o => !o)}>
            Show Full Transcript
          </TranscriptButton>
          <AnimatePresence>
            {open && (
              <motion.div
                style={{ overflow: 'hidden' }}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <InfoContainer
                  dangerouslySetInnerHTML={{ __html: transcript.html }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <PodcastLinks
            apple={data.apple}
            google={data.google}
            spotify={data.spotify}
            stitcher={data.stitcher}
            tuneIn={data.tuneIn}
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
            apple
            google
            spotify
            tuneIn
            stitcher
            description
            episodeNumber

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
