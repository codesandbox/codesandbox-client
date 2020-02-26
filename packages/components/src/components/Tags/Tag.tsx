import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import styled from 'styled-components';

import { Button, Stack, Text } from '../..';

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

type Props<Tag = string> = {
  tag: Tag;
  onRemove?: (tag: Tag) => void;
};
export const Tag: FunctionComponent<Props> = ({ tag, onRemove }) => (
  <TagElement data-component="Tag">
    <Text size={2}>{tag}</Text>

    {onRemove && (
      <Button
        css={{ width: 'auto' }}
        marginLeft={1}
        onClick={() => onRemove(tag)}
        variant="link"
      >
        <CrossIcon />
      </Button>
    )}
  </TagElement>
);
