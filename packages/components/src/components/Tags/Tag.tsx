import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import CrossIcon from 'react-icons/lib/md/clear';
import { Stack } from '../Stack';
import { Element } from '../Element';
import { Text } from '../Text';

export type Props = {
  tag: string;
  onRemove?: (tag: string) => void;
};

export const DeleteIcon = styled(CrossIcon)(
  css({
    transition: 'all ease',
    transitionDuration: theme => theme.speeds[3],
    cursor: 'pointer',
    color: 'tab.inactiveForeground',
    width: '6px',
    display: 'flex',
    height: '6px',

    ':hover': {
      color: 'sideBarTitle.foreground',
    },
  })
);

export const TagElement = styled.div(
  css({
    backgroundColor: 'sideBar.border',
    paddingX: 1,
    paddingY: 1,
    borderRadius: 'small',
  })
);

export function Tag({ tag, onRemove }: Props) {
  return (
    <TagElement key={tag}>
      <Stack align="center" justify="space-between">
        <Text size={1}>{tag}</Text>
        {onRemove && (
          <Element marginLeft={2}>
            <DeleteIcon onClick={() => onRemove(tag)} />
          </Element>
        )}
      </Stack>
    </TagElement>
  );
}
