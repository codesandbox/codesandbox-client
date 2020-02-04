import React from 'react';
import { Stack } from '../Stack';
import { Element } from '../Element';
import { Tag } from './Tag';

type Props = {
  tags: Array<string>;
  align?: 'right' | 'left';
  style?: React.CSSProperties;
  onRemove?: (tag: string) => void;
};

export function Tags({ tags, align, ...props }: Props) {
  return (
    <Stack justify={align === 'right' ? 'flex-end' : 'flex-stat'} {...props}>
      {tags
        .slice()
        .sort()
        .map(tag => (
          <Element key={tag} marginX={1} marginY={1}>
            <Tag tag={tag} {...props} />
          </Element>
        ))}
    </Stack>
  );
}
