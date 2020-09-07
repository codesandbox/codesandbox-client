import React from 'react';
import { action } from '@storybook/addon-actions';
import { List, ListItem, ListAction } from '.';

export default {
  title: 'components/List',
  component: List,
};

// replace the text inside with Text variants when available
export const ListItems = () => (
  <List>
    <ListItem>IBM Plex</ListItem>
    <ListItem>Inter</ListItem>
    <ListItem>Roboto</ListItem>
  </List>
);

export const withJustify = () => (
  <List style={{ width: 300, border: '1px solid white' }}>
    <ListItem justify="space-between">
      {/* eslint-disable-next-line */}
      <label htmlFor="frozen">Frozen</label>
      <input type="checkbox" id="frozen" />
    </ListItem>
    <ListItem justify="space-between">
      <span>Template</span>
      <a
        href="https://codesandbox.io/s/react-new"
        target="_blank"
        rel="noopener noreferrer"
      >
        React
      </a>
    </ListItem>
    <ListItem justify="space-between">
      <span>Environment</span>
      <a
        href="https://github.com/facebookincubator/create-react-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        create-react-app
      </a>
    </ListItem>
  </List>
);

const gitIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 1H14C14.5523 1 15 1.44772 15 2V14C15 14.5523 14.5523 15 14 15H2C1.44772 15 1 14.5523 1 14V2C1 1.44772 1.44772 1 2 1ZM0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2ZM9 12H7V9H4V7H7V4H9V7H12V9H9V12Z"
      fill="#30D158"
    />
  </svg>
);

export const ListActions = () => (
  <List style={{ width: 300, border: '1px solid white' }}>
    <ListAction onClick={action('row clicked')} gap={2}>
      {gitIcon} <span>src/index.js</span>
    </ListAction>
    <ListAction onClick={action('row clicked')} gap={2}>
      {gitIcon} <span>src/style.css</span>
    </ListAction>
    <ListAction onClick={action('row clicked')} gap={2}>
      {gitIcon} <span>package.json</span>
    </ListAction>
  </List>
);

// TODO: Replace a tags with Link component when ready
export const ListActionWithMultipleActions = () => (
  <List style={{ width: 300, border: '1px solid white' }}>
    <ListAction justify="space-between">
      <a
        href="https://rsms.me/inter/inter.css"
        target="_blank"
        rel="noopener noreferrer"
      >
        IBM Plex
      </a>
      <button type="button">×</button>
    </ListAction>
    <ListAction justify="space-between">
      <a
        href="https://rsms.me/inter/inter.css"
        target="_blank"
        rel="noopener noreferrer"
      >
        Inter
      </a>
      <button type="button">×</button>
    </ListAction>
    <ListAction justify="space-between">
      <a
        href="https://rsms.me/inter/inter.css"
        target="_blank"
        rel="noopener noreferrer"
      >
        Roboto
      </a>
      <button type="button">×</button>
    </ListAction>
  </List>
);
