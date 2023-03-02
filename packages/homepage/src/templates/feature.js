import { graphql } from 'gatsby';
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import {
  SeoText,
  ContentBlock,
  Title,
  Banner,
  Tweet,
  User,
  Avatar,
  TitleWrapper,
  Description,
  Wrapper,
} from './_feature.elements';
import Button from '../components/Button';

export default ({
  data: {
    feature: {
      frontmatter: {
        columns,
        bgColor,
        bgImage,
        SEOText,
        description,
        coverImage,
        tweetText,
        tweetJob,
        tweetName,
        photo,
        coverReversed,
        coverSmaller,
        ctaLink,
        ctaText,
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
      css={`
        ${props => props.theme.breakpoints.md} {
          grid-row: 1;
        }
      `}
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
          <Avatar src={photo} alt={tweetName} />
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
      <img className="hero-image" src={coverImage.publicURL} alt={title} />
    </motion.div>
  );
  return (
    <Layout>
      <TitleAndMetaTags title={`${title} - CodeSandbox`} />
      <Wrapper>
        <Title>{title}</Title>

        <TitleWrapper>
          <Description seoText={SEOText}>{description}</Description>
          {ctaLink && ctaText ? (
            <Button target="_blank" href={ctaLink}>
              {ctaText}
            </Button>
          ) : null}
        </TitleWrapper>
        {SEOText ? <SeoText>{SEOText}</SeoText> : null}
        <Banner
          coverSmaller={coverSmaller}
          color={bgColor}
          bgImage={bgImage.publicURL}
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
      </Wrapper>
    </Layout>
  );
};

export const pageQuery = graphql`
  query Feature($id: String) {
    feature: markdownRemark(id: { eq: $id }) {
      frontmatter {
        columns
        bgColor
        bgImage {
          publicURL
        }
        SEOText
        description
        tweetText
        tweetJob
        ctaText
        ctaLink
        tweetName
        tweetHandle
        photo
        coverReversed
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
