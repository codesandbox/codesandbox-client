import React, { useState, useEffect } from 'react';
import WideSandbox from 'common/lib/components/WideSandbox';
import VisibilitySensor from 'react-visibility-sensor';
import Link from 'next/link';
import Button from 'common/lib/components/Button';
import fetch from '../../utils/fetch';
import openSandbox from '../../utils/openSandbox';
import PageContainer from '../../components/PageContainer';
import Sidebar from '../../screens/Profile/sidebar';
import SandboxesWrapper from '../../components/SandboxesWrapper';
import { Grid } from '../profile/_elements';
import { NavigationLink, TabNavigation } from './_elements';

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

  // reset everything when tab changes
  useEffect(
    () => {
      setSandboxes(data[1]);
      setPage(1);
    },
    [currentTab]
  );

  return (
    <PageContainer>
      <Grid>
        <Sidebar {...profile} />
        <main>
          <TabNavigation>
            <Link
              prefetch
              href={`/profile?username=${profile.username}`}
              as={`/profile/${profile.username}`}
            >
              <div
                css={`
                  display: inline-flex;
                  justify-content: center;
                `}
              >
                <NavigationLink>Back to Profile</NavigationLink>
              </div>
            </Link>

            <Link
              prefetch
              href={`/user-sandboxes?username=${
                profile.username
              }&page=sandboxes`}
              as={`/profile/${profile.username}/sandboxes`}
            >
              <div
                css={`
                  display: inline-flex;
                  justify-content: center;
                `}
              >
                <NavigationLink active={currentTab === 'sandboxes'}>
                  Sandboxes
                </NavigationLink>
              </div>
            </Link>
            <Link
              prefetch
              href={`/user-sandboxes?username=${profile.username}&page=liked`}
              as={`/profile/${profile.username}/liked`}
            >
              <div
                css={`
                  display: inline-flex;
                  justify-content: center;
                `}
              >
                <NavigationLink active={currentTab === 'liked'}>
                  Liked
                </NavigationLink>
              </div>
            </Link>
          </TabNavigation>
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
