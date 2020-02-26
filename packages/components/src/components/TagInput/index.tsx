import VisuallyHidden from '@reach/visually-hidden';
import css from '@styled-system/css';
import React, {
  ChangeEvent,
  ComponentProps,
  FunctionComponent,
  useRef,
  useState,
} from 'react';
import TagsInput from 'react-tagsinput';
import styled from 'styled-components';

import { Input, Tag, Text } from '../..';

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
type AutosizeInputProps = Omit<ComponentProps<typeof Input>, 'children'>;
const AutosizeInput: FunctionComponent<AutosizeInputProps> = props => {
  const [inputValue, setInputValue] = useState('');
  const spanRef = useRef<HTMLDivElement>(null);

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
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
        <Text id="tags-input-span" ref={spanRef} size={2}>
          {inputValue}
        </Text>
      </VisuallyHidden>
    </>
  );
};

type Props = Pick<ComponentProps<typeof TagsInput>, 'onChange' | 'value'>;
export const TagInput: FunctionComponent<Props> = ({ onChange, value }) => (
  <TagsInput
    onChange={onChange}
    onlyUnique
    renderInput={props => <AutosizeInput id="tags-input" {...props} />}
    renderLayout={(tagsComponent, inputComponent) => (
      <Layout>
        {tagsComponent}

        {inputComponent}
      </Layout>
    )}
    renderTag={({ onRemove, key, tag }) => (
      <Tag onRemove={() => onRemove(key)} key={key} tag={tag} />
    )}
    value={value}
  />
);
