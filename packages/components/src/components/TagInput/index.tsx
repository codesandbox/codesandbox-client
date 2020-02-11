import React from 'react';
import TagsInput from 'react-tagsinput';
import VisuallyHidden from '@reach/visually-hidden';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Input } from '../Input';
import { Text } from '../Text';
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
      width: 64, // initial width, enough to fit placeholder
      minWidth: 64,
      maxWidth: '100%', // max width = size of container
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

// Input takes the size of the content inside it by using
// a decoy span to calculate width
const AutosizeInput = props => {
  const spanRef = React.useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState('');

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    setInputValue(inputElement.value);
    if (spanRef.current) {
      inputElement.style.width = spanRef.current.offsetWidth + 16 + 'px';
    }
  };

  return (
    <>
      <Input onInput={onInput} {...props} />
      <VisuallyHidden>
        <Text size={2} id="tags-input-span" ref={spanRef}>
          {inputValue}
        </Text>
      </VisuallyHidden>
    </>
  );
};

export const TagInput = ({ value, onChange }) => (
  <TagsInput
    value={value}
    onChange={onChange}
    onlyUnique
    renderTag={({ key, tag, onRemove }) => (
      <Tag tag={tag} key={key} onRemove={() => onRemove(key)} />
    )}
    renderInput={props => <AutosizeInput id="tags-input" {...props} />}
    renderLayout={(tagsComponent, inputComponent) => (
      <Layout>
        {tagsComponent}
        {inputComponent}
      </Layout>
    )}
  />
);
