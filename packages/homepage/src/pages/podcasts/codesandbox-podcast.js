import React from 'react';
// import { graphql, Link } from 'gatsby';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import {
  Header,
  PageTitle,
  PageSubtitle,
  Episodes,
  // EpisodeNumber,
  // Episode,
  // Description,
  // EpisodeTitle,
} from './_elements';

import csb from '../../assets/images/podcasts/csb.jpg';
import allPodcasts from '../../../content/podcasts/info';
import PodcastLinks from '../../components/PodcastLinks';

const info = allPodcasts.find(
  podcast => podcast.slug === 'codesandbox-podcast'
);

const VersionOne = () => (
  <Layout>
    <PageContainer>
      <TitleAndMetaTags
        description={info.description}
        title="CodeSandbox Podcast - CodeSandbox"
        image={csb}
        meta={[
          { name: 'robots', content: 'noindex' },
          { name: 'googlebot', content: 'noindex' },
        ]}
      />
      <Header>
        <img
          css={`
            width: 270px;
            border-radius: 4px;
            border: 1px solid #343434;
          `}
          src={csb}
          alt={info.name}
        />
        <PageTitle
          css={`
            font-size: 48px;
          `}
        >
          {info.name}
        </PageTitle>

        <PageSubtitle
          css={`
            width: 640px;
            max-width: 80%;
            margin: auto;
            line-height: 1.25;
          `}
        >
          {info.description}
        </PageSubtitle>
      </Header>

      <div
        css={`
          margin: 2rem 0 6rem 0;
        `}
      >
        <iframe
          title="CodeSandbox Podcast"
          src="https://player.resonaterecordings.com/embed?uuid=5a6b601f-d415-4b61-848a-08a7597d63a4&accentColor=13,180,206&backgroundColor=242,242,242"
          width="100%"
          height="155"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
        />
      </div>

      <Episodes>
        {/* {episodes
          .filter(e => e.node.frontmatter.slug)
          .map(({ node: { id, frontmatter } }) => (
            <Link
              css={`
                text-decoration: none;
              `}
              key={id}
              to={`podcasts/codesandbox-podcast/${frontmatter.slug}`}
            >         
              <Episode>
                <img
                  src={frontmatter.image.publicURL}
                  alt={frontmatter.title}
                />
                <section>
                  <EpisodeNumber>
                    Episode {frontmatter.episodeNumber}
                  </EpisodeNumber>
                  <EpisodeTitle>{frontmatter.title}</EpisodeTitle>
                  <Description>{frontmatter.description}</Description>
                </section>
              </Episode>
            </Link>
          ))} */}
      </Episodes>
      <PodcastLinks {...info.links} name={info.name} />
    </PageContainer>
  </Layout>
);

// export const query = graphql`
//   {
//     allMarkdownRemark(
//       filter: { fileAbsolutePath: { regex: "/podcasts/codesandbox-podcast/" } }
//       sort: { fields: id, order: DESC }
//     ) {
//       edges {
//         node {
//           id
//           frontmatter {
//             description
//             title
//             slug
//             image {
//               publicURL
//             }
//           }
//         }
//       }
//     }
//   }
// `;

export default VersionOne;
