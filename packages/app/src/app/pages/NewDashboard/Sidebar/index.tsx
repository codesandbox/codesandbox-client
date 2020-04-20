import React from 'react';
import { List, Link, ListAction } from '@codesandbox/components';
import { Link as BaseLink } from 'react-router-dom';

export const Sidebar = () => (
  <List>
    <ListAction>
      <Link to="start" as={BaseLink}>
        Start
      </Link>
    </ListAction>
    <ListAction>
      <Link to="drafts" as={BaseLink}>
        Drafts
      </Link>
    </ListAction>
    <ListAction>
      <Link to="recent" as={BaseLink}>
        Recent
      </Link>
    </ListAction>
    <ListAction>
      <Link to="all" as={BaseLink}>
        All Sandboxes
      </Link>
    </ListAction>
    <ListAction>
      <Link to="templates" as={BaseLink}>
        Templates
      </Link>
    </ListAction>
    <ListAction>
      <Link to="deleted" as={BaseLink}>
        Recently Deleted
      </Link>
    </ListAction>
  </List>
);
