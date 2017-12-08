/* @flow */
import * as React from 'react';
import styled from 'styled-components';

import Margin from 'common/components/spacing/Margin';
import { TagContainer } from './elements';

import Tag from './Tag';

export default ({ tags, removeTag, align, ...props }) => (
  <TagContainer align={align || 'left'} {...props}>
    {tags.sort().map(tag => (
      <Margin key={tag} vertical={0.5} horizontal={0.25}>
        <Tag removeTag={removeTag} tag={tag} />
      </Margin>
    ))}
  </TagContainer>
);
