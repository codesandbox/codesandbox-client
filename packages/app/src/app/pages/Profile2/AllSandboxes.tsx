import React from 'react';
import {
  Grid,
  Column,
  Stack,
  Text,
  Link,
  Button,
  Icon,
  IconButton,
  Menu,
} from '@codesandbox/components';
import css from '@styled-system/css';
import designLanguage from '@codesandbox/components/lib/design-language/theme';
import { motion } from 'framer-motion';
import { useOvermind } from 'app/overmind';
import { SandboxCard, SkeletonCard } from './SandboxCard';
import { SANDBOXES_PER_PAGE, SandboxType } from './constants';

export const AllSandboxes = () => {
  const {
    actions: {
      profile: { fetchSandboxes, sortByChanged, sortDirectionChanged },
    },
    state: {
      profile: {
        current: { username, featuredSandboxes },
        currentSandboxesPage,
        isLoadingSandboxes,
        currentSortBy,
        currentSortDirection,
        sandboxes: fetchedSandboxes,
      },
    },
  } = useOvermind();

  const featuredSandboxIds = featuredSandboxes.map(sandbox => sandbox.id);

  // explicitly call it on first page render
  React.useEffect(() => {
    if (currentSandboxesPage === 1) fetchSandboxes();
  }, [currentSandboxesPage, fetchSandboxes]);

  const sandboxes = (
    (fetchedSandboxes[username] &&
      fetchedSandboxes[username][currentSandboxesPage]) ||
    []
  )
    // filter out featured sandboxes so that we don't show them twice
    .filter(sandbox => !featuredSandboxIds.includes(sandbox.id))
    // only show public sandboxes on profile
    .filter(sandbox => sandbox.privacy === 0);

  if (!sandboxes.length) {
    return (
      <Stack justify="center" align="center" css={css({ height: 320 })}>
        <Text variant="muted" size={4} weight="medium" align="center">
          This user does not have any sandboxes yet
        </Text>
      </Stack>
    );
  }

  return (
    <Stack as="section" direction="vertical" gap={6}>
      <UpgradeBanner />

      <Stack justify="space-between" align="center">
        {featuredSandboxes.length ? (
          <Text size={7} weight="bold">
            All Sandboxes
          </Text>
        ) : (
          <span />
        )}

        <Menu>
          <Stack align="center">
            <Menu.Button>
              <Text variant="muted">
                Sort by {currentSortBy === 'view_count' ? 'views' : 'created'}
              </Text>
            </Menu.Button>
            <IconButton
              name="arrowDown"
              size={11}
              title="Reverse sort direction"
              css={{
                transform: `rotate(${
                  currentSortDirection === 'desc' ? 0 : 180
                }deg)`,
              }}
              onClick={() =>
                sortDirectionChanged(
                  currentSortDirection === 'asc' ? 'desc' : 'asc'
                )
              }
            />
          </Stack>
          <Menu.List>
            <Menu.Item
              field="title"
              onSelect={() => {
                sortByChanged('view_count');
              }}
            >
              <Text variant="body">Sort by views</Text>
            </Menu.Item>
            <Menu.Item
              field="title"
              onSelect={() => {
                sortByChanged('inserted_at');
              }}
            >
              <Text variant="muted">Sort by created</Text>
            </Menu.Item>
          </Menu.List>
        </Menu>
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
                <motion.div layoutTransition={{ duration: 0.15 }}>
                  <SandboxCard
                    type={SandboxType.ALL_SANDBOX}
                    sandbox={sandbox}
                  />
                </motion.div>
              </Column>
            ))}
        <Column />
        <Column />
      </Grid>
      <Pagination />
    </Stack>
  );
};

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

const UpgradeBanner = () => {
  const {
    state: {
      user,
      profile: { current },
      dashboard: { teams },
      personalWorkspaceId,
    },
    actions: { modalOpened },
    effects: { browser },
  } = useOvermind();

  const myProfile = user?.username === current.username;
  const isPro = user && Boolean(user.subscription);

  const [showUpgradeMessage, setShowUpgradeMessage] = React.useState(
    myProfile && browser.storage.get('PROFILE_SHOW_UPGRADE') !== false
  );

  const dontShowUpgradeMessage = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    browser.storage.set('PROFILE_SHOW_UPGRADE', false);
    setShowUpgradeMessage(false);
  };

  if (!showUpgradeMessage) return null;

  const personalWorkspace = teams.find(team => team.id === personalWorkspaceId);

  return (
    <Stack
      as={isPro ? Button : Link}
      href={isPro ? null : '/pro'}
      variant="link"
      onClick={event => {
        // if not pro, the link will take care of it
        if (isPro) modalOpened({ modal: 'minimumPrivacy' });
      }}
      justify="space-between"
      align="center"
      css={css({
        backgroundColor: 'grays.600',
        borderRadius: 'medium',
        paddingLeft: 3,
        paddingRight: 2,
        paddingY: 2,
        color: 'foreground',
        height: 'auto',
        cursor: 'pointer',
        transitionProperty: 'transform',
        transitionDuration: (theme: typeof designLanguage) => theme.speeds[2],
        ':hover': { transform: 'scale(1.01)' },
      })}
    >
      <Stack align="center" gap={4}>
        <Icon
          name="eye"
          size={16}
          css={css({
            flexShrink: 0,
            display: ['none', 'block', 'block'],
          })}
        />
        {isPro ? (
          <Text size={2} css={{ lineHeight: '16px' }}>
            {personalWorkspace.settings.minimumPrivacy === 0
              ? 'Change default privacy settings to hide your drafts'
              : 'Your drafts are hidden. Change default privacy settings to show drafts'}
          </Text>
        ) : (
          <Text size={2} css={{ lineHeight: '16px' }}>
            <Text css={css({ color: 'blues.700' })}>Upgrade to Pro</Text> to
            change default privacy settings to hide your drafts
          </Text>
        )}
      </Stack>

      <IconButton
        name="cross"
        size={10}
        title="Don't show me this again"
        onClick={dontShowUpgradeMessage}
      />
    </Stack>
  );
};
