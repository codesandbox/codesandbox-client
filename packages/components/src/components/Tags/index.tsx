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
      gap={1}
      css={{
        flexWrap: 'wrap',
        // we add margin instead for multiline tags
        // because stack doesn't support multilines
        '> *': { marginBottom: 1 },
      }}
      {...props}
    >
      {tags.slice().map(tag => (
        <Tag key={tag} tag={tag} {...props} />
      ))}
    </Stack>
  );
}
