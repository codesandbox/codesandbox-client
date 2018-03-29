import * as React from 'react';
import Margin from 'common/components/spacing/Margin';

import { TagContainer } from './elements';

import Tag from './Tag';

type Props = {
  tags: string[]
  style?: {}
  align?: 'right' | 'left'
};

const Tags: React.SFC<Props> = ({ tags, align, ...props }) => {
  return (
    <TagContainer align={align || 'left'} {...props}>
      {tags.sort().map(tag => (
        <Margin key={tag} vertical={0.5} horizontal={0.2}>
          <Tag tag={tag} />
        </Margin>
      ))}
    </TagContainer>
  );
}

export default Tags;
