import React from 'react';
import { Grid, Column, Stack, Text, IconButton } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { SandboxCard, SkeletonCard } from './SandboxCard';

export const AllSandboxes = ({ menuControls }) => {
  const {
    actions: {
      profile: { sandboxesPageChanged },
    },
    state: {
      profile: {
        current: { username, featuredSandboxes },
        currentSandboxesPage,
        isLoadingSandboxes,
        sandboxes: fetchedSandboxes,
      },
    },
  } = useOvermind();

  const featuredSandboxIds = featuredSandboxes.map(sandbox => sandbox.id);

  // explicitly call it on first page render
  React.useEffect(() => {
    if (currentSandboxesPage === 1) sandboxesPageChanged(currentSandboxesPage);
  }, [currentSandboxesPage, sandboxesPageChanged]);

  const sandboxes = (
    (fetchedSandboxes[username] &&
      fetchedSandboxes[username][currentSandboxesPage]) ||
    []
  )
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
        {isLoadingSandboxes
          ? Array(15)
              .fill(true)
              .map((_, index) => (
                // eslint-disable-next-line
                <Column key={index}>
                  <SkeletonCard />
                </Column>
              ))
          : sandboxes.map((sandbox, index) => (
              <Column key={sandbox.id}>
                <SandboxCard sandbox={sandbox} menuControls={menuControls} />
              </Column>
            ))}
      </Grid>
      <Pagination />
    </Stack>
  );
};

const SANDBOXES_PER_PAGE = 15;
const Pagination = () => {
  const {
    actions: {
      profile: { sandboxesPageChanged },
    },
    state: {
      profile: {
        currentSandboxesPage,
        current: { sandboxCount, templateCount },
      },
    },
  } = useOvermind();

  const numberOfPages = Math.ceil(
    (sandboxCount + templateCount) / SANDBOXES_PER_PAGE
  );

  return (
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
            onClick={() => sandboxesPageChanged(currentSandboxesPage - 1)}
            disabled={currentSandboxesPage === 1}
          />
        </li>
        <li>
          <IconButton
            name="backArrow"
            title="Next page"
            style={{ transform: 'scaleX(-1)' }}
            onClick={() => sandboxesPageChanged(currentSandboxesPage + 1)}
            disabled={currentSandboxesPage === numberOfPages}
          />
        </li>
      </Stack>
    </nav>
  );
};
