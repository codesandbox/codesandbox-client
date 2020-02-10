import React from 'react';
import TagsInput from 'react-tagsinput';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Input } from '../Input';
import { Tag } from '../Tags/Tag';

type Props = {};

/**
 * Looks like an Input, has the element label
 * Borrows styles from Stack and Tags
 */
const Layout = styled(Input).attrs({
  as: 'label',
  htmlFor: 'tags-input',
})(
  css({
    width: 300,
    display: 'inline-flex',
    alignItems: 'center',
    padding: 1,
    flexWrap: 'wrap',

    height: 'auto',
    input: {
      height: 4,
      paddingX: 0,
      fontSize: 2,
      width: 100,
      border: 'none',
    },
    ':focus-within': {
      borderColor: 'inputOption.activeBorder',
    },
    '[data-component="Tag"]': {
      backgroundColor: 'sideBar.background',
      marginY: 1,
      marginRight: 1,
    },
  })
);

export function TagInput({ value, onChange }) {
  return (
    <TagsInput
      value={value}
      onChange={onChange}
      onlyUnique
      renderTag={Tag}
      renderInput={props => <Input id="tags-input" {...props} />}
      renderLayout={(tagsComponent, inputComponent) => (
        <Layout>
          {tagsComponent}
          {inputComponent}
        </Layout>
      )}
    />
  );
}
