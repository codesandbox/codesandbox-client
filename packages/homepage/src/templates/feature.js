import { graphql } from 'gatsby';
import React from 'react';
import { motion } from 'framer-motion';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import {
  ContentBlock,
  Title,
  Banner,
  Tweet,
  User,
  Avatar,
} from './_feature.elements';

export default ({
  data: {
    feature: {
      frontmatter: {
        columns,
        bgColor,
        description,
        coverImage,
        tweetText,
        tweetJob,
        tweetName,
        tweetHandle,
        coverReversed,
        textCenter,
        coverSmaller,
      },
      fields: { title },
      html,
    },
  },
}) => {
  const TweetSide = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        height: '100%',
        display: 'flex',
      }}
      transition={{
        duration: 1,
        ease: 'easeOut',
      }}
    >
      <Tweet reverse={coverReversed}>
        "{tweetText}"
        <User>
          <Avatar
            src={`https://avatars.io/twitter/${tweetHandle}`}
            alt={tweetName}
          />
          <div>
            <p>{tweetName}</p>
            <p>{tweetJob}</p>
          </div>
        </User>
      </Tweet>
    </motion.div>
  );

  const ImageSide = () => (
    <motion.div
      initial={{ opacity: 0, y: 140 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        ease: 'easeOut',
      }}
    >
      <img src={coverImage.publicURL} alt={title} />
    </motion.div>
  );
  return (
    <Layout>
      <TitleAndMetaTags title={`${title} - CodeSandbox`} />
      <PageContainer width={1086}>
        <Title textCenter={textCenter}>{title}</Title>
        <span>{description}</span>
        <Banner
          coverSmaller={coverSmaller}
          color={bgColor}
          reverse={coverReversed}
        >
          {coverReversed ? (
            <>
              <ImageSide />
              <TweetSide />
            </>
          ) : (
            <>
              <TweetSide />
              <ImageSide />
            </>
          )}
        </Banner>

        <ContentBlock
          columns={columns}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </PageContainer>
    </Layout>
  );
};

export const pageQuery = graphql`
  query Feature($id: String) {
    feature: markdownRemark(id: { eq: $id }) {
      frontmatter {
        columns
        bgColor
        description
        tweetText
        tweetJob
        tweetName
        tweetHandle
        coverReversed
        textCenter
        coverSmaller
        coverImage {
          publicURL
        }
      }
      fields {
        title
      }
      html
    }
  }
`;
