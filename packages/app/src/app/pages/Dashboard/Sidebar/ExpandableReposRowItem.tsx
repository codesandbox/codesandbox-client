import React from 'react';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { AnimatePresence, motion } from 'framer-motion';
import { orderBy } from 'lodash-es';
import { Link as RouterLink } from 'react-router-dom';
import { useAppState } from 'app/overmind';
import {
  Element,
  Icon,
  IconButton,
  Link,
  Stack,
} from '@codesandbox/components';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { RowItem } from './RowItem';

export const ExpandableReposRowItem = () => {
  const [isExpanded, setIsExpanded] = useGlobalPersistedState(
    'SIDEBAR_REPOS_EXPANDED',
    false
  );
  const { activeTeam, sidebar } = useAppState();

  return (
    <>
      <RowItem
        name="All repositories"
        page="repositories"
        path={dashboardUrls.repositories(activeTeam)}
        icon="repository"
      >
        <Stack css={{ width: '100%', height: '100%' }}>
          {sidebar.repositories.length > 0 ? (
            <IconButton
              name="caret"
              size={8}
              title="Toggle repositories"
              onClick={event => {
                setIsExpanded(!isExpanded);
                event.stopPropagation();
              }}
              css={{
                width: '16px',
                height: '100%',
                borderRadius: 0,
                svg: {
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 100ms ease-in-out',
                },
              }}
            />
          ) : (
            <Element as="span" css={{ width: '16px', flexShrink: 0 }} />
          )}
          <Link
            as={RouterLink}
            css={{
              display: 'flex',
              flexGrow: 1,
              padding: '10px 4px',
              lineHeight: '16px',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={dashboardUrls.repositories(activeTeam)}
          >
            <Icon name="repository" size={16} css={{ marginRight: '8px' }} />
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
            {orderBy(
              sidebar.repositories,
              repo => repo.name.toLowerCase(),
              'asc'
            ).map(repo => (
              <RowItem
                name={repo.name}
                page="repositories"
                path={dashboardUrls.repository(repo)}
                icon="branch"
                nestingLevel={1}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};
