import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Stack,
  Text,
  Element,
  Grid,
  Column,
  Link,
} from '@codesandbox/components';
import css from '@styled-system/css';

import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';

import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { CommunitySandbox } from 'app/pages/Dashboard/Components/CommunitySandbox';
import { Album } from 'app/graphql/types';
import { DashboardCommunitySandbox } from 'app/pages/Dashboard/types';
import { PICKED_SANDBOXES_ALBUM } from './contants';

export const Discover = () => {
  const {
    activeTeam,
    dashboard: { sandboxes, curatedAlbums },
  } = useAppState();

  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.DISCOVER);
    if (!sandboxes.LIKED) getPage(sandboxesTypes.LIKED);
  }, [getPage, sandboxes.LIKED]);

  const pickedSandboxesAlbum = curatedAlbums.find(
    album => album.id === PICKED_SANDBOXES_ALBUM
  );

  const flatAlbumSandboxes = Array.prototype.concat.apply(
    [],
    curatedAlbums.map(album => album.sandboxes)
  );

  const selectionItems: DashboardCommunitySandbox[] = flatAlbumSandboxes.map(
    sandbox => ({
      type: 'community-sandbox',
      sandbox,
    })
  );

  return (
    <Element
      css={{ width: '100%', '#selection-container': { overflowY: 'auto' } }}
    >
      <Helmet>
        <title>Discover - CodeSandbox</title>
      </Helmet>
      <SelectionProvider
        activeTeamId={activeTeam}
        page="discover"
        items={selectionItems}
      >
        <Element
          css={css({
            marginX: 'auto',
            width: `calc(100% - ${2 * GUTTER}px)`,
            maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
            paddingY: 10,
          })}
        >
          <Stack
            align="center"
            css={css({
              width: '100%',
              height: 195,
              background: 'linear-gradient(#422677, #392687)',
              borderRadius: 'medium',
              position: 'relative',
              marginBottom: 12,
            })}
          >
            <Stack direction="vertical" marginLeft={6} css={{ zIndex: 2 }}>
              <Text size={4} marginBottom={2}>
                NEW FEATURE
              </Text>
              <Text size={9} weight="bold" marginBottom={1}>
                Discover Search
              </Text>
              <Text size={5} css={{ opacity: 0.5 }}>
                Blazzy fast to search files inside your sandbox.
              </Text>
            </Stack>
            <Element
              as="img"
              src="/static/img/discover-banner-decoration.png"
              css={css({
                position: 'absolute',
                right: 0,
                zIndex: 1,
                opacity: [0.5, 1, 1],
              })}
            />
          </Stack>

          <Stack direction="vertical" gap={16}>
            {pickedSandboxesAlbum && (
              <Section album={pickedSandboxesAlbum} showMore={false} />
            )}

            {curatedAlbums
              .filter(album => album.id !== PICKED_SANDBOXES_ALBUM)
              .map(album => (
                <Section
                  key={album.id}
                  album={album}
                  showMore={album.sandboxes.length > 3}
                />
              ))}
          </Stack>
        </Element>
      </SelectionProvider>
    </Element>
  );
};

type SectionTypes = { album: Album; showMore: boolean };
const Section: React.FC<SectionTypes> = ({ album, showMore = false }) => {
  const {
    dashboard: { sandboxes },
  } = useAppState();

  const likedSandboxIds = (sandboxes.LIKED || []).map(sandbox => sandbox.id);

  return (
    <Stack key={album.id} direction="vertical" gap={6}>
      <Stack justify="space-between">
        <Text size={4} weight="bold">
          {album.title}
        </Text>
        {showMore && (
          <Link size={4} variant="muted">
            See all →
          </Link>
        )}
      </Stack>

      <Grid
        id="variable-grid"
        rowGap={6}
        columnGap={6}
        css={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {album.sandboxes.slice(0, 3).map(sandbox => (
          <Column key={sandbox.id}>
            <CommunitySandbox
              isScrolling={false}
              item={{
                type: 'community-sandbox',
                noDrag: true,
                autoFork: false,
                sandbox: {
                  ...sandbox,
                  liked: likedSandboxIds.includes(sandbox.id),
                },
              }}
            />
          </Column>
        ))}
        <div />
        <div />
      </Grid>
    </Stack>
  );
};
