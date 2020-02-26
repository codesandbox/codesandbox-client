import React, { ComponentProps, CSSProperties, FunctionComponent } from 'react';

import { Stack } from '../..';

import { Tag } from './Tag';

type TagProps = ComponentProps<typeof Tag>;
type Props = Pick<TagProps, 'onRemove'> & {
  style?: CSSProperties;
  tags: Array<TagProps['tag']>;
};
export const Tags: FunctionComponent<Props> = ({ onRemove, style, tags }) => (
  <Stack
    align="center"
    css={{
      flexWrap: 'wrap',

      // we add margin instead for multiline tags
      // because stack doesn't support multilines
      '> *': {
        marginBottom: 1,
      },
    }}
    gap={1}
    style={style}
  >
    {tags.slice().map(tag => (
      <Tag onRemove={onRemove} key={tag} tag={tag} />
    ))}
  </Stack>
);
