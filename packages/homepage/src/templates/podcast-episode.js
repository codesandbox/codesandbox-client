import { graphql, Link } from 'gatsby';
import React from 'react';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import PodcastLinks from '../components/PodcastLinks';

import TitleAndMetaTags from '../components/TitleAndMetaTags';

import { Article, Header, PostTitle, PostContainer } from './_post.elements';

export default ({
  data: {
    episode: {
      frontmatter: {
        image: { publicURL },
        podcastName,
        title,
        guestName,
        guestTwitter,
        appleLink,
        googleLink,
        spotify,
        audio,
        airDate,
        description,
        episodeNumber,
      },
      html,
    },
  },
}) => (
  <Layout css={``}>
    <Article>
      <TitleAndMetaTags
        image={publicURL}
        title={`${podcastName} - ${title}- CodeSandbox`}
      />

      <Header>
        <Link to="podcasts">{podcastName}</Link>

        <PostTitle>{title}</PostTitle>
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <img
            alt={title}
            src={publicURL}
            css={`
              width: 64px;
              border-radius: 2px;
              margin-right: 16px;
            `}
          />
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
              {guestName}
            </span>
            <a
              href={`https://twitter.com/${guestTwitter}`}
              target="_blank"
              rel="noreferrer"
              css={`
                color: #757575;
                text-decoration: none;
              `}
            >
              @{guestTwitter}
            </a>
          </div>
        </div>
      </Header>

      <PageContainer width={640}>
        <section
          css={`
            padding-bottom: 34px;
          `}
        >
          <h4
            css={`
              font-weight: 900;
              font-size: 33px;
              line-height: 44px;
              color: #ffffff;
              margin-bottom: 16px;
            `}
          >
            Episode 0{episodeNumber}
          </h4>
          <time
            css={`
              font-weight: 500;
              font-size: 16px;
              line-height: 19px;
              color: #757575;
            `}
          >
            {airDate}
          </time>
        </section>
        <span
          css={`
            font-size: 1.1rem;
            line-height: 1.6rem;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.75);
            padding: 0;
          `}
        >
          {description.split(`\n`).map(des => (
            <span key={des}>
              {des}
              <br />
              <br />
            </span>
          ))}
        </span>

        <PostContainer dangerouslySetInnerHTML={{ __html: html }} />

        <PodcastLinks
          appleLink={appleLink}
          googleLink={googleLink}
          spotify={spotify}
          name={podcastName}
        />
      </PageContainer>
      <iframe
        css={`
          position: fixed;
          bottom: 0;
          z-index: 999;
          left: 0;
          background-color: rgb(242, 242, 242);
          max-width: 100vw;
        `}
        title={title}
        src={audio}
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
