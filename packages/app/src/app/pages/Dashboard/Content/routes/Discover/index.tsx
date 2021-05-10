import React from 'react';
import { Helmet } from 'react-helmet';
import { sampleSize, shuffle } from 'lodash-es';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Text,
  Element,
  Grid,
  Column,
  Link,
  Avatar,
} from '@codesandbox/components';
import css from '@styled-system/css';
import {
  dashboard,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';

import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';

import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { CommunitySandbox } from 'app/pages/Dashboard/Components/CommunitySandbox';
import { Stats } from 'app/pages/Dashboard/Components/CommunitySandbox/CommunitySandboxCard';
import { AnonymousAvatar } from 'app/pages/Dashboard/Components/CommunitySandbox/AnonymousAvatar';
import {
  DashboardCommunitySandbox,
  DashboardAlbum,
} from 'app/pages/Dashboard/types';
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
    if (!curatedAlbums.length) getPage(sandboxesTypes.DISCOVER);
    if (!sandboxes.LIKED) getPage(sandboxesTypes.LIKED);
  }, [getPage, sandboxes.LIKED]);

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

  // We want to randomly pick 8 album to show
  // but don't want it to update on every render
  const randomAlbums = React.useMemo(() => {
    const randomAlbumIds = shuffle(
      sampleSize(
        curatedAlbums
          .map(album => album.id)
          .filter(id => id !== PICKED_SANDBOXES_ALBUM),
        8
      )
    );

    // shuffle sandboxes inside the album
    return randomAlbumIds
      .map(albumId => curatedAlbums.find(album => album.id === albumId))
      .map(album => ({ ...album, sandboxes: shuffle(album.sandboxes) }));
  }, [curatedAlbums]);

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
            <PickedSandboxes />

            {randomAlbums.map(album => (
              <Collection
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

const PickedSandboxes = () => {
  const {
    dashboard: { curatedAlbums },
  } = useAppState();

  const pickedSandboxesAlbum = curatedAlbums.find(
    album => album.id === PICKED_SANDBOXES_ALBUM
  );

  return (
    <Grid
      rowGap={6}
      columnGap={6}
      css={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        height: 'max(60vh, 528px)',
        overflow: 'hidden',
      }}
    >
      {pickedSandboxesAlbum?.sandboxes.slice(0, 3).map(sandbox => (
        <PickedSandbox key={sandbox.id} sandbox={sandbox} />
      ))}
    </Grid>
  );
};

export const PickedSandbox = ({ sandbox }) => {
  const {
    dashboard: { sandboxes },
  } = useAppState();
  const {
    dashboard: { likeCommunitySandbox, unlikeSandbox },
  } = useActions();

  const url = sandboxUrl({ id: sandbox.id, alias: sandbox.alias });
  const likedSandboxIds = (sandboxes.LIKED || []).map(s => s.id);
  const liked = likedSandboxIds.includes(sandbox.id);

  const [managedLikeCount, setLikeCount] = React.useState(sandbox.likeCount);
  const [managedLiked, setLiked] = React.useState(liked);

  const onLikeToggle = () => {
    if (managedLiked) {
      unlikeSandbox(sandbox.id);
      setLiked(false);
      setLikeCount(managedLikeCount - 1);
    } else {
      likeCommunitySandbox(sandbox.id);
      setLiked(true);
      setLikeCount(managedLikeCount + 1);
    }
  };

  return (
    <Element
      css={{
        position: 'relative',
        button: { color: 'white' },
        span: { color: 'white' },
      }}
    >
      <Link
        href={url}
        target="_blank"
        block
        css={css({
          width: '100%',
          height: 'max(60vh, 528px)',
          border: '1px solid',
          borderColor: 'grays.600',
          borderRadius: 'medium',
          overflow: 'hidden',
        })}
      >
        <Element
          as="img"
          src={sandbox.screenshotUrl}
          css={css({
            objectFit: 'cover',
            height: '100%',
            width: '100%',
            willChange: 'transform',
            transition: 'transform',
            transitionDuration: theme => theme.speeds[4],
            ':hover': {
              transform: 'scale(1.05)',
            },
          })}
        />
      </Link>
      <Stack
        justify="space-between"
        align="flex-end"
        gap={2}
        css={css({
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          background: 'linear-gradient(transparent, #000000b3)',
          padding: 4,
          paddingRight: 3,
          borderRadius: 'medium',
          height: 160,
        })}
      >
        <Stack
          align="center"
          gap={2}
          css={{ flexShrink: 1, overflow: 'hidden' }}
        >
          {sandbox.author.username ? (
            <Avatar
              css={css({
                size: 6,
                borderRadius: 2,
                img: { borderColor: 'white' },
              })}
              user={sandbox.author}
            />
          ) : (
            <AnonymousAvatar />
          )}
          <Text size={3} maxWidth="100%">
            {sandbox.author.username || 'Anonymous'}
          </Text>
        </Stack>

        <Stats
          likeCount={managedLikeCount}
          forkCount={sandbox.forkCount}
          liked={managedLiked}
          onLikeToggle={onLikeToggle}
        />
      </Stack>
    </Element>
  );
};

type CollectionTypes = { album: DashboardAlbum; showMore: boolean };
const Collection: React.FC<CollectionTypes> = ({ album, showMore = false }) => {
  const {
    activeTeam,
    dashboard: { sandboxes },
  } = useAppState();

  const likedSandboxIds = (sandboxes.LIKED || []).map(sandbox => sandbox.id);

  return (
    <Stack key={album.id} direction="vertical" gap={6}>
      <Stack justify="space-between" align="flex-end">
        <Text size={6} weight="bold">
          {album.title}
        </Text>
        {showMore && (
          <Link
            as={RouterLink}
            to={dashboard.discover(activeTeam, album.id)}
            size={4}
            variant="muted"
          >
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
