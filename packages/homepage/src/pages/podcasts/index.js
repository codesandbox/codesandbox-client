import React from 'react';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import { Header, PageTitle, PageSubtitle } from './_elements';

import version1 from '../../assets/images/podcasts/version1.png';
import csb from '../../assets/images/podcasts/csb.png';
import { Link } from 'gatsby';

const Blog = () => (
  <Layout>
    <PageContainer>
      <TitleAndMetaTags
        description="Level up by listening to podcasts from the best in the industry"
        title="Podcasts - CodeSandbox"
      />

      <Header>
        <PageTitle
          css={`
            font-size: 48px;
          `}
        >
          Podcasts
        </PageTitle>

        <PageSubtitle
          css={`
            font-size: 19px;
            color: #999999;
          `}
        >
          Level up by listening to podcasts from the best in the industry
        </PageSubtitle>
      </Header>

      <div
        css={`
          margin-top: 80px;
          margin-bottom: 230px;
          display: flex;
          align-items: center;
          justify-content: center;

          a:not(:last-child) {
            margin-right: 36px;
          }

          img {
            filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.24)),
              drop-shadow(0px 8px 4px rgba(0, 0, 0, 0.12));
            border-radius: 8px;
            transition: transform 100ms ease;
            width: 415px;

            :hover {
              transform: scale(1.03);
            }
          }
        `}
      >
        <Link to="podcasts/version-one">
          <img src={version1} alt="Version One Podcast" />
        </Link>
        <Link to="podcasts/codesanbdox-podcast">
          <img src={csb} alt="CodeSandbox Podcast" />
        </Link>
      </div>
    </PageContainer>
  </Layout>
);

export default Blog;
