import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Stack } from '../Stack';
import { Button } from '../Button';
import { Text } from '../Text';
import { Icon } from '../Icon';

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
          autoWidth
          onClick={() => onRemove(tag)}
          marginLeft={1}
        >
          <Icon size={7} name="cross" />
        </Button>
      )}
    </TagElement>
  );
}
