import React from 'react';
import TagsInput from 'react-tagsinput';
import { GlobalStyle } from './elements';

// To destructure this we need to import an interface
// for template
export const EditableTags = (props: any) => (
  <>
    <GlobalStyle color={props.template.color} />
    <TagsInput {...props} />
  </>
);
