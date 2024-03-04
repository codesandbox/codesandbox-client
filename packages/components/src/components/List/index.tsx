import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';
import { Stack } from '../Stack';

type ListActionProps = {
  disabled?: boolean;
};

export const List = styled(Element).attrs(p => ({
  as: ((p as unknown) as { as: string }).as || 'ul',
}))(
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

export const ListAction = styled(ListItem)<ListActionProps>(({ disabled }) =>
  css({
    ':hover, &[aria-selected="true"]': {
      cursor: !disabled ? 'pointer' : 'not-allowed',
      color: !disabled ? 'list.hoverForeground' : 'inherit',
      backgroundColor: !disabled ? 'list.hoverBackground' : 'inherit',
    },
    ':focus-within': {
      color: !disabled ? 'list.hoverForeground' : 'inherit',
      backgroundColor: !disabled ? 'list.hoverBackground' : 'inherit',
    },
  })
);

export const SidebarListItem = styled(Stack).attrs({
  as: 'li',
  align: 'center',
})(
  css({
    minHeight: 8,
    color: 'list.foreground',
    fontSize: 14,
    overflow: 'hidden',
  })
);

export const SidebarListAction = styled(SidebarListItem)<ListActionProps>(
  ({ disabled }) =>
    css({
      ':hover, &[aria-selected="true"]': {
        cursor: !disabled ? 'pointer' : 'not-allowed',
        color: !disabled ? 'list.hoverForeground' : 'inherit',
        backgroundColor: !disabled ? 'list.hoverBackground' : 'inherit',
      },
    })
);
