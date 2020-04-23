import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Element, List, ListAction, Link } from '@codesandbox/components';
import css from '@styled-system/css';

export const Sidebar = props => (
  <Element
    as="aside"
    {...props}
    css={css({
      borderRight: '1px solid',
      borderColor: 'sideBar.border',
      width: [0, 0, 240],
      flexShrink: 0,
      display: ['none', 'none', 'block'],
    })}
  >
    <List>
      <ListAction>
        <Link to="start" as={RouterLink}>
          Start
        </Link>
      </ListAction>
      <ListAction>
        <Link to="drafts" as={RouterLink}>
          Drafts
        </Link>
      </ListAction>
      <ListAction>
        <Link to="recent" as={RouterLink}>
          Recent
        </Link>
      </ListAction>
      <ListAction>
        <Link to="all" as={RouterLink}>
          All Sandboxes
        </Link>
      </ListAction>
      <ListAction>
        <Link to="templates" as={RouterLink}>
          Templates
        </Link>
      </ListAction>
      <ListAction>
        <Link to="deleted" as={RouterLink}>
          Recently Deleted
        </Link>
      </ListAction>
    </List>
  </Element>
);
