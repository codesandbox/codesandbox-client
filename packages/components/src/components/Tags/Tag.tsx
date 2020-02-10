import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import CrossIcon from 'react-icons/lib/md/clear';

import { Stack } from '../Stack';
import { Button } from '../Button';
import { Text } from '../Text';

const TagElement = styled(Stack)(
  css({
    height: 4,
    lineHeight: 1, // trust the height
    backgroundColor: 'sideBar.border',
    paddingX: 1,
    borderRadius: 'small',
  })
);

type TagProps = {
  children: string;
  onRemove?: (tag: string) => void;
};

export function Tag({ children, onRemove }: TagProps) {
  return (
    <TagElement align="center" justify="space-between">
      <Text size={2}>{children}</Text>
      {onRemove && (
        <Button
          variant="link"
          onClick={() => onRemove(children)}
          marginLeft={1}
        >
          <CrossIcon />
        </Button>
      )}
    </TagElement>
  );
}
