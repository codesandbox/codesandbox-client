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
      },
      fields: { title },
      html,
    },
  },
}) => (
  <Layout>
    <TitleAndMetaTags title={`${title} - CodeSandbox`} />
    <PageContainer width={1086}>
      <Title>{title}</Title>
      <span>{description}</span>
      <Banner color={bgColor}>
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
          <Tweet>
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
      </Banner>

      <ContentBlock
        columns={columns}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </PageContainer>
  </Layout>
);

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
