import React from 'react';
import { Stack } from '../Stack';
import { Tag } from './Tag';

type Props = {
  tags: Array<string>;
  style?: React.CSSProperties;
  onRemove?: (tag: string) => void;
};

export function Tags({ tags, ...props }: Props) {
  return (
    <Stack
      align="center"
      css={{
        flexWrap: 'wrap',
        // we use margin instead of gap
        // to apply margin for multiline tags
        '> *': { margin: 1 },
      }}
      {...props}
    >
      {tags.slice().map(tag => (
        <Tag key={tag} tag={tag} {...props} />
      ))}
    </Stack>
  );
}
