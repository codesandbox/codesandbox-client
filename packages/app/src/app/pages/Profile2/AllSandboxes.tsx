import React from 'react';
import {
  Stack,
  Grid,
  Column,
  Text,
  Stats,
  Link,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useDrag } from 'react-dnd';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';

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

const SandboxCard = ({ sandbox, updateFeaturedSandboxes }) => {
  const [, drag] = useDrag({
    item: { id: sandbox.id, type: 'sandbox' },
    end: (item: { id: string }, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult.name === 'PINNED_SANDBOXES') {
        const { id } = item;
        updateFeaturedSandboxes({ featuredSandboxIds: [id] });
      }
    },
  });

  return (
    <div ref={drag}>
      <Stack
        as={Link}
        href={sandboxUrl({ id: sandbox.id, alias: sandbox.alias })}
        direction="vertical"
        gap={4}
        css={css({
          backgroundColor: 'grays.700',
          border: '1px solid',
          borderColor: 'grays.600',
          borderRadius: 'medium',
          overflow: 'hidden',
          ':hover, :focus, :focus-within': {
            boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
          },
        })}
      >
        <div
          css={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '160px',
            backgroundColor: 'grays.600',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            borderBottom: '1px solid',
            borderColor: 'grays.600',
          })}
          style={{
            backgroundImage: `url(${sandbox.screenshotUrl ||
              `/api/v1/sandboxes/${sandbox.id}/screenshot.png`})`,
          }}
        />
        <Stack direction="vertical" gap={2} marginX={4} marginBottom={4}>
          <Text>{sandbox.title || sandbox.alias || sandbox.id}</Text>
          <Stats sandbox={sandbox} />
        </Stack>
      </Stack>
    </div>
  );
};
