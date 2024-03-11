import React from 'react';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { AnimatePresence, motion } from 'framer-motion';
import { orderBy } from 'lodash-es';
import { Link as RouterLink } from 'react-router-dom';
import { useAppState } from 'app/overmind';
import { Icon, IconButton, Link, Stack } from '@codesandbox/components';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { RowItem } from './RowItem';

export const ExpandableReposRowItem = () => {
  const { activeTeam, sidebar } = useAppState();

  if (
    !activeTeam ||
    !sidebar[activeTeam] ||
    sidebar[activeTeam].repositories.length === 0
  ) {
    return (
      <RowItem
        name="All repositories"
        page="repositories"
        path={dashboardUrls.repositories(activeTeam)}
        icon="repository"
      />
    );
  }

  return (
    <RowItemWithExpandableRepos
      key={activeTeam} // Remount component on active workspace change to reset expanded state
      activeTeam={activeTeam}
      repositories={sidebar[activeTeam].repositories}
    />
  );
};

export const RowItemWithExpandableRepos: React.FC<{
  activeTeam: string;
  repositories: Array<{ owner: string; name: string }>;
}> = ({ repositories, activeTeam }) => {
  const [isExpanded, setIsExpanded] = useGlobalPersistedState(
    `SIDEBAR_REPOS_EXPANDED_${activeTeam}`,
    repositories.length <= 5
  );

  return (
    <>
      <RowItem
        name="All repositories"
        page="repositories"
        path={dashboardUrls.repositories(activeTeam)}
        icon="repository"
      >
        <Stack css={{ width: '100%', height: '100%' }}>
          <IconButton
            name="caret"
            size={8}
            title="Toggle repositories"
            onClick={event => {
              setIsExpanded(!isExpanded);
              event.stopPropagation();
            }}
            css={{
              width: '24px',
              height: '100%',
              borderRadius: 0,
              '&:focus-visible': {
                boxShadow: 'none',
                outlineOffset: '-1px',
                outline: '1px solid #ac9cff',
              },
              svg: {
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 100ms ease-in-out',
              },
            }}
          />
          <Link
            as={RouterLink}
            css={{
              display: 'flex',
              flexGrow: 1,
              padding: '10px 3px',
              lineHeight: '16px',
              textDecoration: 'none',
              color: 'inherit',
              '&:focus-visible': {
                outlineOffset: '-1px',
                outline: '1px solid #ac9cff',
              },
            }}
            to={dashboardUrls.repositories(activeTeam)}
          >
            <Icon name="repository" size={16} css={{ marginRight: '7px' }} />
            All repositories
          </Link>
        </Stack>
      </RowItem>
      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.15 } }}
            style={{ paddingLeft: 0 }}
          >
            {orderBy(repositories, repo => repo.name.toLowerCase(), 'asc').map(
              repo => (
                <RowItem
                  name={repo.name}
                  key={`${repo.owner}/${repo.name}`}
                  page="repositories"
                  path={dashboardUrls.repository(repo)}
                  icon="branch"
                  nestingLevel={1}
                />
              )
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};
