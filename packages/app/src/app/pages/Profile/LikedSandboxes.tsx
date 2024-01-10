import React from 'react';
import { Grid, Column, Stack, Text, IconButton } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { SandboxCard, SkeletonCard } from './SandboxCard';
import { SANDBOXES_PER_PAGE } from './constants';

export const LikedSandboxes = () => {
  const { likedSandboxesPageChanged } = useActions().profile;
  const {
    current: { username },
    isLoadingSandboxes,
    currentLikedSandboxesPage,
    likedSandboxes,
  } = useAppState().profile;

  // explicitly call it on first page render
  React.useEffect(() => {
    if (currentLikedSandboxesPage === 1) likedSandboxesPageChanged(1);
  }, [currentLikedSandboxesPage, likedSandboxesPageChanged]);

  const sandboxes = (
    (likedSandboxes[username] &&
      likedSandboxes[username][currentLikedSandboxesPage]) ||
    []
  )
    // only show public sandboxes on profile
    .filter(sandbox => sandbox.privacy === 0);

  if (!isLoadingSandboxes && sandboxes.length === 0) {
    return (
      <Stack justify="center" align="center">
        <Text variant="muted" size={4} weight="medium" align="center">
          This user does not have any liked sandboxes yet
        </Text>
      </Stack>
    );
  }

  return (
    <Stack as="section" direction="vertical" gap={6}>
      <Stack justify="space-between" align="center">
        <Text size={7} weight="bold">
          Liked Sandboxes
        </Text>
      </Stack>

      <Grid
        rowGap={6}
        columnGap={6}
        css={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {isLoadingSandboxes
          ? Array(SANDBOXES_PER_PAGE)
              .fill(true)
              .map((_: boolean, index) => (
                // eslint-disable-next-line
                <Column key={index}>
                  <SkeletonCard />
                </Column>
              ))
          : sandboxes.map((sandbox, index) => (
              <Column key={sandbox.id}>
                <SandboxCard sandbox={sandbox} />
              </Column>
            ))}
        <div />
        <div />
      </Grid>
      <Pagination />
    </Stack>
  );
};

const Pagination = () => {
  const { likedSandboxesPageChanged } = useActions().profile;
  const {
    currentLikedSandboxesPage,
    current: { givenLikeCount },
  } = useAppState().profile;

  const numberOfPages = Math.ceil(givenLikeCount / SANDBOXES_PER_PAGE);

  if (numberOfPages < 2) return null;

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
            onClick={() =>
              likedSandboxesPageChanged(currentLikedSandboxesPage - 1)
            }
            disabled={currentLikedSandboxesPage === 1}
          />
        </li>
        <li>
          <IconButton
            name="backArrow"
            title="Next page"
            style={{ transform: 'scaleX(-1)' }}
            onClick={() =>
              likedSandboxesPageChanged(currentLikedSandboxesPage + 1)
            }
            disabled={currentLikedSandboxesPage === numberOfPages}
          />
        </li>
      </Stack>
    </nav>
  );
};
