import React from 'react';
import { Grid, Column, Stack, Text } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { SandboxCard } from './SandboxCard';

export const AllSandboxes = () => {
  const {
    actions: {
      profile: { sandboxesPageChanged, updateFeaturedSandboxes },
    },
    state: {
      profile: {
        current: { username, featuredSandboxes },
        isLoadingSandboxes,
        sandboxes: fetchedSandboxes,
      },
    },
  } = useOvermind();

  const [page] = React.useState(0);

  React.useEffect(() => {
    sandboxesPageChanged(page);
  }, [sandboxesPageChanged, page]);

  if (isLoadingSandboxes) return <span>loading</span>;

  if (!fetchedSandboxes[username]) return <span>none</span>;

  const sandboxes = fetchedSandboxes[username][page];

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
            <SandboxCard
              sandbox={sandbox}
              updateFeaturedSandboxes={updateFeaturedSandboxes}
            />
          </Column>
        ))}
      </Grid>
    </Stack>
  );
};
