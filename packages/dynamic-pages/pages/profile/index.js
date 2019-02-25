import React from 'react';
import styled from 'styled-components';
import FeaturedSandbox from 'common/components/FeaturedSandbox';
import { sandboxUrl } from 'common/utils/url-generator';
import WideSandbox from 'common/components/WideSandbox';
import Sidebar from '../../screens/Profile/sidebar';
import fetch from '../../utils/fetch';
import PageContainer from '../../components/PageContainer';

const Grid = styled.main`
  display: grid;
  grid-gap: 90px;
  grid-template-columns: 480px 1fr;
`;

const Title = styled.h3`
  font-family: Poppins;
  font-weight: 300;
  font-size: 24px;
  color: #f2f2f2;
`;

const Sandboxes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2rem;

  margin: 0 -0.5rem;

  @media screen and (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export default class extends React.Component {
  static async getInitialProps({ query: { username }, req }) {
    const profile = await fetch(req, `/api/v1/users/${username}`);
    const sandboxes = await fetch(req, `/api/v1/users/${username}/sandboxes`);
    const liked = await fetch(req, `/api/v1/users/${username}/sandboxes/liked`);
    return { profile: profile.data, sandboxes, liked };
  }

  openSandbox = id => {
    const url = sandboxUrl({ id });
    window.open(url, '_blank');
  };

  render() {
    const { profile, liked } = this.props;
    console.log(liked);
    return (
      <PageContainer>
        <Grid>
          <Sidebar {...profile} />
          <main>
            <div style={{ marginBottom: 30 }}>
              <FeaturedSandbox sandboxId={profile.showcased_sandbox_shortid} />
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
            <Title>Liked sandboxes</Title>
            <Sandboxes>
              {liked[1].map(sandbox => (
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
