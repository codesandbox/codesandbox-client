import React from 'react';
import { List, ListItem, ListAction } from '.';

export default {
  title: 'components/List',
  component: List,
};

// replace the text inside with Text variants when available
export const Basic = () => (
  <List>
    <ListItem>IBM Plex</ListItem>
    <ListItem>Inter</ListItem>
    <ListItem>Roboto</ListItem>
  </List>
);

// TODO: Replace a tags with Link component when ready
export const Actions = () => (
  <List>
    <ListAction>
      <a
        href="https://rsms.me/inter/inter.css"
        target="_blank"
        rel="noopener noreferrer"
      >
        IBM Plex
      </a>
    </ListAction>
    <ListAction>
      <a
        href="https://rsms.me/inter/inter.css"
        target="_blank"
        rel="noopener noreferrer"
      >
        Inter
      </a>
    </ListAction>
    <ListAction>
      <a
        href="https://rsms.me/inter/inter.css"
        target="_blank"
        rel="noopener noreferrer"
      >
        Roboto
      </a>
    </ListAction>
  </List>
);
