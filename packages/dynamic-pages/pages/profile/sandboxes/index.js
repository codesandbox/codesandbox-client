import React, { useState } from 'react';
import WideSandbox from 'common/components/WideSandbox';
import styled from 'styled-components';
import Button from 'common/components/Button';
import { sandboxUrl } from 'common/utils/url-generator';
import fetch from '../../../utils/fetch';
import PageContainer from '../../../components/PageContainer';
import Sidebar from '../../../screens/Profile/sidebar';
import SandboxesWrapper from '../../../components/SandboxesWrapper';

const Grid = styled.main`
  display: grid;
  grid-gap: 90px;
  grid-template-columns: 480px 1fr;
`;

const Sandboxes = ({ data, fetchUrl, profile }) => {
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
        <SandboxesWrapper>
          {sandboxes.map(sandbox => (
            <>
              <WideSandbox
                small
                key={sandbox.id}
                pickSandbox={({ id }) => openSandbox(id)}
                sandbox={sandbox}
              />
            </>
          ))}
        </SandboxesWrapper>
        {more ? (
          <Button
            css={`
              width: 100%;
            `}
            disabled={loading}
            onClick={() => loadMore(fetchUrl)}
          >
            Load More
          </Button>
        ) : null}
      </Grid>
    </PageContainer>
  );
};

Sandboxes.getInitialProps = async ({ query: { page, username } }) => {
  const url = page === 'sandboxes' ? '' : '/liked';
  const profile = await fetch(`/api/v1/users/${username}`);
  const data = await fetch(`/api/v1/users/${username}/sandboxes${url}`);

  return {
    data,
    fetchUrl: `/api/v1/users/${username}/sandboxes${url}`,
    profile: profile.data,
  };
};

export default Sandboxes;
