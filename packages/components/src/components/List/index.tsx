import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';
import { Stack } from '../Stack';

export const List = styled(Element).attrs({ as: 'ul' })(
  css({
    listStyle: 'none',
    paddingLeft: 0,
    margin: 0,
  })
);

export const ListItem = styled(Stack).attrs({
  as: 'li',
  align: 'center',
})(
  css({
    minHeight: 8,
    paddingX: 2,
    color: 'list.foreground',
  })
);

export const ListAction = styled(ListItem)<{ disabled?: boolean }>(
  ({ disabled }) =>
    css({
      ':hover, &[aria-selected="true"]': {
        cursor: !disabled ? 'pointer' : 'disabled',
        color: !disabled ? 'list.hoverForeground' : 'inherit',
        backgroundColor: !disabled ? 'list.hoverBackground' : 'inherit',
      },
      ':focus-within': {
        color: !disabled ? 'list.hoverForeground' : 'inherit',
        backgroundColor: !disabled ? 'list.hoverBackground' : 'inherit',
      },
    })
);
