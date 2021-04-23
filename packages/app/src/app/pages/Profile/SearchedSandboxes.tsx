import React from 'react';
import Fuse from 'fuse.js';
import { useAppState } from 'app/overmind';
import { Grid, Column, Stack, IconButton } from '@codesandbox/components';
import css from '@styled-system/css';
import { SandboxCard, SkeletonCard } from './SandboxCard';

const SANDBOXES_PER_PAGE = 15;

export const SearchedSandboxes = () => {
  const {
    isLoadingSandboxes,
    current: { username },
    searchQuery,
    sandboxes: fetchedSandboxes,
  } = useAppState().profile;

  const [page, setPage] = React.useState(1);

  const results = React.useMemo(() => {
    const allSandboxes = fetchedSandboxes[username].all || [];
    const fuse = new Fuse(allSandboxes, {
      threshold: 0.1,
      distance: 1000,
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.2 },
        { name: 'alias', weight: 0.2 },
        { name: 'source.template', weight: 0.1 },
        { name: 'id', weight: 0.1 },
      ],
    });

    return fuse.search(searchQuery);
  }, [fetchedSandboxes, username, searchQuery]);

  return (
    <Stack as="section" direction="vertical" gap={6}>
      <Grid
        rowGap={6}
        columnGap={6}
        css={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {isLoadingSandboxes
          ? Array(15)
              .fill(true)
              .map((_: boolean, index) => (
                // eslint-disable-next-line
                <Column key={index}>
                  <SkeletonCard />
                </Column>
              ))
          : results
              .slice((page - 1) * SANDBOXES_PER_PAGE, page * SANDBOXES_PER_PAGE)
              .map((sandbox, index) => (
                <Column key={sandbox.id}>
                  <SandboxCard sandbox={sandbox} />
                </Column>
              ))}

        <div />
        <div />
      </Grid>
      <Pagination
        page={page}
        setPage={setPage}
        numberOfPages={Math.ceil(results.length / SANDBOXES_PER_PAGE)}
      />
    </Stack>
  );
};

const Pagination: React.FC<{
  page: number;
  setPage: (page: number) => void;
  numberOfPages: number;
}> = ({ page, setPage, numberOfPages }) => (
  <nav role="navigation" aria-label="Pagination Navigation">
    <Stack
      as="ul"
      gap={4}
      justify="center"
      align="center"
      css={css({ marginX: 0, marginY: 10, listStyle: 'none' })}
    >
      <li>
        <IconButton
          name="backArrow"
          title="Previous page"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        />
      </li>
      <li>
        <IconButton
          name="backArrow"
          title="Next page"
          style={{ transform: 'scaleX(-1)' }}
          onClick={() => setPage(page + 1)}
          disabled={page === numberOfPages}
        />
      </li>
    </Stack>
  </nav>
);
