import React from 'react';
import { Link } from 'gatsby';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import { Header, PageTitle, PageSubtitle, Podcasts } from './_elements';

import version1 from '../../assets/images/podcasts/version1.png';
import csb from '../../assets/images/podcasts/csb.png';

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

      <Podcasts>
        <Link to="podcasts/version-one">
          <img src={version1} alt="Version One Podcast" />
        </Link>
        <Link to="podcasts/codesanbdox-podcast">
          <img src={csb} alt="CodeSandbox Podcast" />
        </Link>
      </Podcasts>
    </PageContainer>
  </Layout>
);

export default Blog;
