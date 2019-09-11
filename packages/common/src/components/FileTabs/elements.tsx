import React from 'react';
import { Element } from 'react-ui/primitives';
import PlusIcon from 'react-icons/lib/go/plus';

import Row from '../flex/Row';

const styles = {
  Tabs: {
    backgroundColor: 'grays.5',
    fontSize: 2,
    boxShadow: 'underline',
  },
  Tab: {
    color: 'white',
    paddingY: 3,
    paddingLeft: 2,
    cursor: 'pointer',

    '&[aria-selected]': {
      boxShadow: 'active',
      '& svg': {
        opacity: 1,
      },
    },
    '&:hover svg': {
      opacity: 1,
    },
  },
  Close: {
    fontSize: 1,
    marginY: 1,
    opacity: 0,
    // close icon is a lie, it's just a rotated PlusIcon
    // TODO: replace it with a skinny X
    transform: 'rotate(45deg)',
  },
};

export const Tabs = props => <Element as={Row} css={styles.Tabs} {...props} />;
export const Tab = props => <Element as="div" css={styles.Tab} {...props} />;
export const Close = props => (
  <Element as={PlusIcon} css={styles.Close} {...props} />
);
