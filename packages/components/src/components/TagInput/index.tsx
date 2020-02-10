import React from 'react';
import TagsInput from 'react-tagsinput';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Input } from '../Input';
import { Tag } from '../Tags/Tag';

/**
 * Looks like an Input, has the element label
 * Borrows styles from Stack and Tags
 */
const Layout = styled(Input).attrs({
  as: 'label',
  htmlFor: 'tags-input',
})(
  css({
    display: 'inline-flex',
    alignItems: 'center',
    paddingX: 1,
    flexWrap: 'wrap',
    minHeight: 8,
    height: 'auto', // let it grow to multiline
    input: {
      height: 4,
      paddingX: 0,
      fontSize: 2,
      width: 100,
      border: 'none',
      marginY: 1,
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

export function TagInput({ value, onChange, inputValue, onChangeInput }) {
  return (
    <TagsInput
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onChangeInput={onChangeInput}
      onlyUnique
      renderTag={({ key, tag, onRemove }) => (
        <Tag tag={tag} onRemove={() => onRemove(key)} />
      )}
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
