import React from 'react';
import { Grid, Column } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { SandboxCard } from './SandboxCard';

export const AllSandboxes = () => {
  const {
    actions: {
      profile: { sandboxesPageChanged, updateFeaturedSandboxes },
    },
    state: {
      profile: {
        current: { username },
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
  );
};
