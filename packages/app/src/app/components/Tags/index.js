/* @flow */
import * as React from 'react';

import Margin from 'common/components/spacing/Margin';
import { TagContainer } from './elements';

import Tag from './Tag';

function Tags({ tags, removeTag, align, ...props }) {
  return (
    <TagContainer align={align || 'left'} {...props}>
      {tags.sort().map(tag => (
        <Margin key={tag} vertical={0.5} horizontal={0.25}>
          <Tag removeTag={removeTag} tag={tag} />
        </Margin>
      ))}
    </TagContainer>
  );
}

export default Tags;
