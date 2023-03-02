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
  let link;
  try {
    link =
      'podcasts/' +
      episode.edges[0].node.fileAbsolutePath
        .split('/homepage/content/podcasts/')[1]
        .split('/')[0];
  } catch {
    link = 'podcasts/';
  }

  return (
    <Layout>
      <Article>
        <TitleAndMetaTags
          image={data.socialImage.publicURL}
          title={`${data.podcastName} - ${data.title}- CodeSandbox`}
          description={data.description}
          keywords={data.tags}
        />

        <Header>
          <Link to={link}>{data.podcastName}</Link>
          <PostTitle
            css={`
              max-width: 860px;
              margin: auto;
            `}
          >
            {data.title}
          </PostTitle>
          <GuestInfo>
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
          <Audio
            title={data.title}
            src={data.audio}
            width="100%"
            height="155"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
          />

          <InfoContainer dangerouslySetInnerHTML={{ __html: html }} />

          <TranscriptButton
            open={open}
            type="button"
            onClick={() => setOpen(o => !o)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M12.6 6.21057H11.4V11.6106H6V12.8106H11.4V18.2106H12.6V12.8106H18V11.6106H12.6V6.21057Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {open ? 'Hide' : 'Show'} Full Transcript
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
        </PageContainer>
        <PodcastLinks
          apple={data.apple}
          google={data.google}
          spotify={data.spotify}
          stitcher={data.stitcher}
          tuneIn={data.tuneIn}
          name={data.podcastName}
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
          fileAbsolutePath
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
            tags

            socialImage {
              publicURL
            }

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
