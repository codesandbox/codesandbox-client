import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import CrossIcon from 'react-icons/lib/md/clear';

import { Stack } from '../Stack';
import { Button } from '../Button';
import { Text } from '../Text';

const TagElement = styled(Stack).attrs({
  inline: true,
  align: 'center',
  justify: 'space-between',
})(
  css({
    height: '18px', // hardcoded off the scale
    lineHeight: 1, // trust the height
    backgroundColor: 'sideBar.border',
    paddingX: 1,
    borderRadius: 'small',
  })
);

type TagProps = {
  tag: string;
  onRemove?: (tag: string) => void;
};

export function Tag({ tag, onRemove }: TagProps) {
  return (
    <TagElement data-component="Tag">
      <Text size={2}>{tag}</Text>
      {onRemove && (
        <Button
          variant="link"
          css={{ width: 'auto' }}
          onClick={() => onRemove(tag)}
          marginLeft={1}
        >
          <CrossIcon />
        </Button>
      )}
    </TagElement>
  );
}
