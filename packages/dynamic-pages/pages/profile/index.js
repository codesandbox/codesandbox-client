import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import FeaturedSandbox from 'common/components/FeaturedSandbox';
import { sandboxUrl } from 'common/utils/url-generator';
import WideSandbox from 'common/components/WideSandbox';
import Sidebar from '../../screens/Profile/sidebar';
import fetch from '../../utils/fetch';
import PageContainer from '../../components/PageContainer';
import SandboxesWrapper from '../../components/SandboxesWrapper';

const Grid = styled.main`
  display: grid;
  grid-gap: 60px;
  grid-template-columns: 400px 1fr;
`;

const Title = styled.h3`
  font-family: Poppins, arial;
  font-weight: 300;
  font-size: 24px;
  color: #f2f2f2;
`;

const Profile = ({ profile, liked }) => {
  const openSandbox = id => {
    const url = sandboxUrl({ id });
    window.open(url, '_blank');
  };

  return (
    <PageContainer>
      <Grid>
        <Sidebar {...profile} />
        <main>
          <div style={{ marginBottom: 30 }}>
            <FeaturedSandbox sandboxId={profile.showcased_sandbox_shortid} />
          </div>
          <Title>User sandboxes</Title>
          <SandboxesWrapper>
            {profile.top_sandboxes.map(sandbox => (
              <WideSandbox
                small
                key={sandbox.id}
                pickSandbox={({ id }) => openSandbox(id)}
                sandbox={sandbox}
              />
            ))}
            <Link
              href={{
                pathname: `/profile/${profile.username}/sandboxes`,
              }}
            >
              <a>See all sandboxes</a>
            </Link>
          </SandboxesWrapper>
          <Title>Liked sandboxes</Title>
          <SandboxesWrapper>
            {liked[1]
              .slice(0, 5)
              .map(sandbox => (
                <WideSandbox
                  small
                  key={sandbox.id}
                  pickSandbox={({ id }) => this.openSandbox(id)}
                  sandbox={sandbox}
                />
              ))}
            <Link
              href={{
                pathname: `/profile/${profile.username}/liked`,
              }}
            >
              See all liked sandboxes
            </Link>
          </SandboxesWrapper>
        </main>
      </Grid>
    </PageContainer>
  );
};

Profile.getInitialProps = async ({ query: { username } }) => {
  const profile = await fetch(`/api/v1/users/${username}`);
  const sandboxes = await fetch(`/api/v1/users/${username}/sandboxes`);
  const liked = await fetch(`/api/v1/users/${username}/sandboxes/liked?page=1`);
  return { profile: profile.data, sandboxes, liked };
};

export default Profile;
