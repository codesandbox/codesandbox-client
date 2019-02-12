import React from 'react';
import styled from 'styled-components';
import FeaturedSandbox from 'common/components/FeaturedSandbox';
import fetch from '../../utils/fetch';
import PageContainer from '../../components/PageContainer';
import { H3, H4 } from '../../components/Typography';

import { Forks, Likes, Views } from '../../components/Icons';

const Grid = styled.main`
  display: grid;
  grid-gap: 90px;
  grid-template-columns: 480px 1fr;
`;

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 8px;
  margin-right: 32px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const Aside = styled.aside`
  background: #1c2022;
  border-radius: 8px;
  padding: 32px;
`;

const Stats = styled.div`
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(3, min-content);
  grid-gap: 35px;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;

function kFormatter(num) {
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
}

export default class extends React.Component {
  static async getInitialProps({ query, req }) {
    const profile = await fetch(req, `/api/v1/users/${query.username}`);
    const sandboxes = await fetch(
      req,
      `/api/v1/users/${query.username}/sandboxes`
    );
    return { profile: profile.data, sandboxes };
  }

  render() {
    const { profile } = this.props;
    return (
      <PageContainer>
        <Grid>
          <Aside>
            <Header>
              <Avatar
                src={profile.avatar_url}
                alt={profile.name}
                width="96"
                height="96"
              />
              <div>
                <H3>{profile.name}</H3>
                <H4>{profile.username}</H4>
              </div>
            </Header>
            <p>{profile.bio}This is a test bio</p>
            <Stats>
              <Stat>
                <Views /> {kFormatter(profile.view_count)}
              </Stat>
              <Stat>
                <Likes /> {kFormatter(profile.received_like_count)}
              </Stat>
              <Stat>
                <Forks /> {kFormatter(profile.forked_count)}
              </Stat>
            </Stats>
          </Aside>
          <main>
            <FeaturedSandbox
              // title={featuredSandboxInfo.title}
              // description={featuredSandboxInfo.description}
              // sandboxId={featuredSandboxInfo.sandboxId}
              featuredSandboxes={profile.featured_sandboxes}
              // pickSandbox={this.selectSandbox}
            />
          </main>
        </Grid>
      </PageContainer>
    );
  }
}
