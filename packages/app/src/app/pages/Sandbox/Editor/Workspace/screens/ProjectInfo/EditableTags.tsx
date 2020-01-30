import css from '@styled-system/css';
import React from 'react';
import TagsInput from 'react-tagsinput';
import { Tag, Stack, Element, Input } from '@codesandbox/components';

const TagComponent = props => (
  <Element marginY={1}>
    <Tag {...props} onRemove={() => props.onRemove(props.key)} />
  </Element>
);

const InputComponent = ({ className, ...other }) => (
  <Input
    {...other}
    placeholder="Add Tag"
    css={css({
      maxWidth: '45px',
      fontSize: 1,
      paddingX: 1,
      height: '19px',
      '::-webkit-input-placeholder': { fontSize: 1 },
      '::-ms-input-placeholder': { fontSize: 1 },
      '::placeholder': { fontSize: 1 },
    })}
  />
);

export const EditableTags = (props: any) => (
  <TagsInput
    {...props}
    renderTag={TagComponent}
    renderInput={InputComponent}
    renderLayout={(tagComponents, inputComponent) => (
      <Stack align="center" gap={1}>
        {tagComponents}
        {props.value.length !== 5 ? inputComponent : null}
      </Stack>
    )}
  />
);
