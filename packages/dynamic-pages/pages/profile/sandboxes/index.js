import React, { useState } from 'react';
import WideSandbox from 'common/lib/components/WideSandbox';
import VisibilitySensor from 'react-visibility-sensor';
import Link from 'next/link';
import Button from 'common/lib/components/Button';
import { sandboxUrl } from 'common/lib/utils/url-generator';
import fetch from '../../../utils/fetch';
import PageContainer from '../../../components/PageContainer';
import Sidebar from '../../../screens/Profile/sidebar';
import SandboxesWrapper from '../../../components/SandboxesWrapper';
import { Grid, Title, NavigationLink, TabNavigation } from '../_elements';

const Sandboxes = ({ data, fetchUrl, profile, currentTab }) => {
  const [page, setPage] = useState(1);
  const [sandboxes, setSandboxes] = useState(data[page]);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async url => {
    const newPage = page + 1;
    setPage(newPage);
    setLoading(true);
    const newSandboxes = await fetch(`${url}?page=${newPage}`);
    setLoading(false);

    if (newSandboxes[newPage].length > 0) {
      return setSandboxes(sandboxes.concat(newSandboxes[newPage]));
    }

    return setMore(false);
  };

  const openSandbox = id => {
    const url = sandboxUrl({ id });
    window.open(url, '_blank');
  };

  return (
    <PageContainer>
      <Grid>
        <Sidebar {...profile} />
        <main>
          <TabNavigation>
            <Link
              href={{
                pathname: `/profile/${profile.username}`,
              }}
            >
              <NavigationLink>Profile</NavigationLink>
            </Link>

            <Link
              href={{
                pathname: `/profile/${profile.username}/sandboxes`,
              }}
            >
              <NavigationLink active={currentTab === 'sandboxes'}>
                Sandboxes
              </NavigationLink>
            </Link>
            <Link
              href={{
                pathname: `/profile/${profile.username}/liked`,
              }}
            >
              <NavigationLink active={currentTab === 'liked'}>
                Liked
              </NavigationLink>
            </Link>
          </TabNavigation>
          <Title>{currentTab === 'liked' ? 'Liked' : ''} Sandboxes</Title>
          <SandboxesWrapper
            css={`
              grid-row-gap: 40px;
            `}
          >
            {sandboxes.map(sandbox => (
              <WideSandbox
                small
                key={sandbox.id}
                pickSandbox={({ id }) => openSandbox(id)}
                sandbox={sandbox}
              />
            ))}
          </SandboxesWrapper>
          {more ? (
            <VisibilitySensor
              partialVisibility
              offset={{ top: 100 }}
              onChange={visible => visible && loadMore(fetchUrl)}
            >
              <Button
                css={`
                  width: 100%;
                  margin-top: 60px;
                `}
                disabled={loading}
                onClick={() => loadMore(fetchUrl)}
              >
                Load More
              </Button>
            </VisibilitySensor>
          ) : null}
        </main>
      </Grid>
    </PageContainer>
  );
};

Sandboxes.getInitialProps = async ({ query: { page, username } }) => {
  const url = page === 'sandboxes' ? '' : '/liked';
  const profile = await fetch(`/api/v1/users/${username}`);
  const data = await fetch(`/api/v1/users/${username}/sandboxes${url}`);

  return {
    currentTab: page,
    data,
    fetchUrl: `/api/v1/users/${username}/sandboxes${url}`,
    profile: profile.data,
  };
};

export default Sandboxes;
