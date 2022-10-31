import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Link as RouterLink,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import {
  Stack,
  Text,
  Element,
  Grid,
  Column,
  Link,
  Avatar,
  ThemeProvider,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

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
import { shuffleSeed } from './utils';
import { Header } from './Header';
import {
  FEATURED_SANDBOXES_ALBUM,
  TRENDING_SANDBOXES_ALBUM,
  banner,
} from './constants';
import { AlbumView } from './AlbumView';

const today = new Date();
const SEED = today.getDate() + today.getMonth() + today.getFullYear();

export const Discover = withRouter(({ history }) => {
  return (
    <ThemeProvider>
      <Element
        css={{ width: '100%', '#selection-container': { overflowY: 'auto' } }}
      >
        <Helmet>
          <title>Discover - CodeSandbox</title>
        </Helmet>
        <Header />
        <Element
          css={css({
            width: '100%',
            height: '100%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
          })}
        >
          <Switch>
            <Route path="/discover/:id" component={AlbumView} />
            <Route path="/discover" component={AlbumList} />
          </Switch>
        </Element>
      </Element>
    </ThemeProvider>
  );
});

export const AlbumList = () => {
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
  }, [getPage, sandboxes.LIKED, curatedAlbums.length]);

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
    const randomAlbumIds = shuffleSeed(
      curatedAlbums
        .map(album => album.id)
        .filter(id => id !== FEATURED_SANDBOXES_ALBUM)
        .filter(id => id !== TRENDING_SANDBOXES_ALBUM),
      SEED
    ).slice(0, 8);

    // shuffle sandboxes inside the album
    return randomAlbumIds
      .map(albumId => curatedAlbums.find(album => album.id === albumId))
      .map(album => ({
        ...album,
        sandboxes: shuffleSeed(album.sandboxes, SEED),
      }));
  }, [curatedAlbums]);

  return (
    <SelectionProvider
      interactive={false}
      activeTeamId={activeTeam}
      page="discover"
      items={selectionItems}
    >
      <Element
        css={css({
          marginX: 'auto',
          width: `calc(100% - ${2 * GUTTER}px)`,
          maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
          paddingY: 0,
          userSelect: 'none',
        })}
      >
        <Banner />

        <Stack direction="vertical" gap={16}>
          {/* <FeaturedSandboxes /> */}

          {randomAlbums.map(album => (
            <Album
              key={album.id}
              album={album}
              showMore={album.sandboxes.length > 3}
            />
          ))}

          <TrendingSandboxes />
        </Stack>
      </Element>
    </SelectionProvider>
  );
};

const Banner = () => (
  <Stack
    as={Link}
    href={banner.link}
    target="_blank"
    align="center"
    css={css({
      width: '100%',
      height: 195,
      background: 'linear-gradient(#422677, #392687)',
      borderRadius: 'medium',
      overflow: 'hidden',
      position: 'relative',
      marginBottom: 12,
      willChange: 'transform',
      transition: 'transform',
      transitionDuration: theme => theme.speeds[4],
      ':hover, :focus': {
        transform: 'scale(1.01)',
      },
    })}
  >
    <Stack direction="vertical" marginLeft={6} css={{ zIndex: 2 }}>
      <Text size={4} marginBottom={2}>
        {banner.label}
      </Text>
      <Text size={9} weight="bold" marginBottom={1}>
        {banner.title}
      </Text>
      <Text size={5} css={{ opacity: 0.5 }}>
        {banner.subtitle}
      </Text>
    </Stack>
    <Element
      as="img"
      src={banner.image}
      css={css({
        position: 'absolute',
        height: '100%',
        right: 0,
        zIndex: 1,
        opacity: [0.25, 1, 1],
      })}
    />
  </Stack>
);

// const FeaturedSandboxes = () => {
//   const {
//     dashboard: { curatedAlbums },
//   } = useAppState();

//   const featuredSandboxesAlbum = curatedAlbums.find(
//     album => album.id === FEATURED_SANDBOXES_ALBUM
//   );

//   return (
//     <Grid
//       rowGap={6}
//       columnGap={6}
//       css={{
//         gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//         height: 'max(60vh, 528px)',
//         overflow: 'hidden',
//       }}
//     >
//       {featuredSandboxesAlbum?.sandboxes.slice(0, 3).map(sandbox => (
//         <FeaturedSandbox key={sandbox.id} sandbox={sandbox} />
//       ))}
//     </Grid>
//   );
// };

export const FeaturedSandbox = ({ sandbox }) => {
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
          willChange: 'transform', // because child has will change
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
          as={sandbox.author?.username ? Link : Text}
          href={`https://codesandbox.io/u/${sandbox.author?.username}`}
          variant="muted"
          target="_blank"
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
          url={url}
        />
      </Stack>
    </Element>
  );
};

type AlbumTypes = { album: DashboardAlbum; showMore: boolean };
const Album: React.FC<AlbumTypes> = ({ album, showMore = false }) => {
  const {
    dashboard: { sandboxes },
  } = useAppState();

  const likedSandboxIds = (sandboxes.LIKED || []).map(sandbox => sandbox.id);

  if (album.sandboxes.length === 0) return null;
  return (
    <Stack key={album.id} direction="vertical" gap={6}>
      <Stack justify="space-between" align="flex-end">
        <Text size={6} weight="bold">
          {album.title}
        </Text>
        {showMore && (
          <Link
            as={RouterLink}
            to={`/discover/${album.id}`}
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
          height: '264px',
          overflow: 'hidden',
        }}
      >
        {album.sandboxes.map(sandbox => (
          <Column key={sandbox.id}>
            <CommunitySandbox
              interactive={false}
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

const TrendingSandboxes = () => {
  const {
    dashboard: { curatedAlbums, sandboxes },
  } = useAppState();

  const trendingSandboxesAlbum = curatedAlbums.find(
    album => album.id === TRENDING_SANDBOXES_ALBUM
  ) || {
    title: null,
    sandboxes: [],
  };

  const likedSandboxIds = (sandboxes.LIKED || []).map(s => s.id);

  /** Infinite scroll */
  const batchSize = 25;
  const maxLimit = trendingSandboxesAlbum.sandboxes.length;
  const [limit, setLimit] = React.useState(batchSize);

  const endOfGrid = React.useRef(null);
  React.useEffect(
    function addMoreAtScrollEnd() {
      /** An interesection observer watches for intersection with
       * the end of the grid and adds more sandboxes to the grid
       */

      const observer = new IntersectionObserver(entities => {
        const target = entities[0];
        if (target.isIntersecting) {
          if (limit < maxLimit) setLimit(count => count + batchSize);
          else observer.disconnect(); // no more sandboxes
        }
      });

      observer.observe(endOfGrid.current);

      return () => observer.unobserve(endOfGrid.current);
    },
    [limit, maxLimit]
  );

  return (
    <Stack direction="vertical" gap={6} css={css({ marginTop: '100px' })}>
      <Text size={6} weight="bold">
        {trendingSandboxesAlbum.title}
      </Text>

      <Grid
        id="variable-grid"
        rowGap={6}
        columnGap={6}
        css={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {trendingSandboxesAlbum.sandboxes.slice(0, limit).map(sandbox => (
          <Column key={sandbox.id}>
            <CommunitySandbox
              interactive={false}
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
      <div ref={endOfGrid} />
    </Stack>
  );
};
