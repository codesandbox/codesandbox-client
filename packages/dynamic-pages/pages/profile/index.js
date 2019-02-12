import React from 'react';
import styled from 'styled-components';
import FeaturedSandbox from 'common/components/FeaturedSandbox';
import { sandboxUrl } from 'common/utils/url-generator';
import WideSandbox from 'common/components/WideSandbox';
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

const Title = styled.h3`
  font-family: Poppins;
  font-weight: 300;
  font-size: 24px;
  color: #f2f2f2;
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

const Sandboxes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2rem;

  /* accomodate for the margin of the sandboxes */
  margin: 0 -0.5rem;

  @media screen and (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
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

    const { data } = await fetch(
      req,
      `/api/v1/users/sandboxes/${profile.showcased_sandbox_shortid}`
    );
    return { profile: profile.data, sandboxes, featured: data };
  }

  openSandbox = id => {
    const url = sandboxUrl({ id });
    window.open(url, '_blank');
  };

  render() {
    const { profile, featured } = this.props;

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
            <div style={{ marginBottom: 30 }}>
              <FeaturedSandbox sandboxes={[featured]} />
            </div>
            <Title>User sandboxes</Title>
            <Sandboxes>
              {profile.top_sandboxes.map(sandbox => (
                <WideSandbox
                  small
                  key={sandbox.id}
                  pickSandbox={({ id }) => this.openSandbox(id)}
                  sandbox={sandbox}
                />
              ))}
            </Sandboxes>
          </main>
        </Grid>
      </PageContainer>
    );
  }
}
