import React from 'react';
import {
  Grid,
  Column,
  Stack,
  Text,
  Button,
  IconButton,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { SandboxCard } from './SandboxCard';

export const AllSandboxes = ({ menuControls }) => {
  const {
    actions: {
      profile: { sandboxesPageChanged },
    },
    state: {
      profile: {
        current: { username, featuredSandboxes },
        isLoadingSandboxes,
        sandboxes: fetchedSandboxes,
      },
    },
  } = useOvermind();

  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    sandboxesPageChanged(page);
  }, [sandboxesPageChanged, page]);

  if (isLoadingSandboxes) return <span>loading</span>;

  if (!fetchedSandboxes[username]) return <span>none</span>;

  const featuredSandboxIds = featuredSandboxes.map(sandbox => sandbox.id);

  const sandboxes = (fetchedSandboxes[username][page] || [])
    // filter out featured sandboxes so that we don't show them twice
    .filter(sandbox => !featuredSandboxIds.includes(sandbox.id))
    // only show public sandboxes on profile
    .filter(sandbox => sandbox.privacy === 0);

  return (
    <Stack as="section" direction="vertical" gap={6}>
      {featuredSandboxes.length ? (
        <Text size={7} weight="bold">
          All Sandboxes
        </Text>
      ) : null}
      <Grid
        rowGap={6}
        columnGap={6}
        css={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {sandboxes.map(sandbox => (
          <Column key={sandbox.id}>
            <SandboxCard sandbox={sandbox} menuControls={menuControls} />
          </Column>
        ))}
      </Grid>
      <Pagination page={page} setPage={setPage} />
    </Stack>
  );
};

const SANDBOXES_PER_PAGE = 15;
const Pagination = ({ page: currentPage, setPage }) => {
  const {
    state: {
      profile: {
        current: { sandboxCount, templateCount },
      },
    },
  } = useOvermind();

  const numberOfPages = Math.ceil(
    (sandboxCount + templateCount) / SANDBOXES_PER_PAGE
  );

  const pages = Array(numberOfPages)
    .fill(true)
    .map((_, index) => index)
    .filter(page => page);

  return (
    <nav role="navigation" aria-label="Pagination Navigation">
      <Stack
        as="ul"
        gap={4}
        justify="center"
        align="center"
        css={{ marginX: 0, marginY: 10, listStyle: 'none' }}
      >
        <li>
          <IconButton
            name="backArrow"
            title="Previous page"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </li>
        {pages.map(page => (
          <li>
            <Button
              key={page}
              variant="link"
              onClick={() => setPage(page)}
              aria-label={`Goto page ${page}`}
              aria-current={page === currentPage}
              css={css({
                flex: 0,
                borderRadius: 0,
                fontWeight: page === currentPage ? 'bold' : 'normal',
                color: page === currentPage ? 'foreground' : 'mutedForeground',
                boxShadow: theme =>
                  page === currentPage
                    ? `0px 1px 0px 0px ${theme.colors.blues[500]}`
                    : 'none',
              })}
            >
              {page}
            </Button>
          </li>
        ))}
        <li>
          <IconButton
            name="backArrow"
            title="Next page"
            style={{ transform: 'scaleX(-1)' }}
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === numberOfPages}
          />
        </li>
      </Stack>
    </nav>
  );
};
