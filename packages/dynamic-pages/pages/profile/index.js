import React from 'react';
import Link from 'next/link';
import FeaturedSandbox from 'common/lib/components/FeaturedSandbox';
import { sandboxUrl } from 'common/lib/utils/url-generator';
import WideSandbox from 'common/lib/components/WideSandbox';

import NotFound from '../../screens/Profile/NotFound';
import Sidebar from '../../screens/Profile/sidebar';
import fetch from '../../utils/fetch';
import PageContainer from '../../components/PageContainer';
import Slider from '../../components/Slider';

import { Grid, Title, More } from './_elements';

const Profile = ({ profile, liked, showcased }) => {
  const openSandbox = id => {
    const url = sandboxUrl({ id });
    window.open(url, '_blank');
  };

  return profile ? (
    <PageContainer>
      <Grid>
        <Sidebar {...profile} />
        <main
          css={`
            // chromebug
            display: block;
            min-height: 0;
            min-width: 0;
          `}
        >
          {showcased ? (
            <div
              css={`
                margin-bottom: 30px;
                font-size: 0.875rem;
              `}
            >
              <FeaturedSandbox
                height={450}
                pickSandbox={({ id }) => openSandbox(id)}
                sandbox={showcased}
                description={showcased.description}
                title={showcased.title}
              />
            </div>
          ) : null}
          <Title>User sandboxes</Title>
          <Slider>
            {profile.top_sandboxes.map(sandbox => (
              <WideSandbox
                small
                key={sandbox.id}
                pickSandbox={({ id }) => openSandbox(id)}
                sandbox={sandbox}
              />
            ))}
            <More>
              <Link
                href={{
                  pathname: `/profile/${profile.username}/sandboxes`,
                }}
              >
                <a>See all sandboxes</a>
              </Link>
            </More>
          </Slider>

          <Title>Liked sandboxes</Title>
          <Slider>
            {liked[1]
              .slice(0, 5)
              .map(sandbox => (
                <WideSandbox
                  small
                  key={sandbox.id}
                  pickSandbox={({ id }) => openSandbox(id)}
                  sandbox={sandbox}
                />
              ))}
            <More>
              <Link
                href={{
                  pathname: `/profile/${profile.username}/liked`,
                }}
              >
                <a>See all liked sandboxes</a>
              </Link>
            </More>
          </Slider>
        </main>
      </Grid>
    </PageContainer>
  ) : (
    <NotFound />
  );
};

Profile.getInitialProps = async ({ query: { username } }) => {
  const profile = await fetch(`/api/v1/users/${username}`);
  const sandboxes = await fetch(`/api/v1/users/${username}/sandboxes`);
  const liked = await fetch(`/api/v1/users/${username}/sandboxes/liked?page=1`);
  let showcased = { data: {} };
  if (profile.data) {
    showcased = await fetch(
      `/api/v1/sandboxes/${profile.data.showcased_sandbox_shortid}`
    );
  }
  return { profile: profile.data, sandboxes, liked, showcased: showcased.data };
};

export default Profile;
