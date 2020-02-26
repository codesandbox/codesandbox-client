import css from '@styled-system/css';
import styled from 'styled-components';

import { Element, Stack } from '../..';

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
        cursor: disabled ? 'disabled' : 'pointer',
        color: disabled ? 'inherit' : 'list.hoverForeground',
        backgroundColor: disabled ? 'inherit' : 'list.hoverBackground',
      },

      ':focus-within': {
        color: disabled ? 'inherit' : 'list.hoverForeground',
        backgroundColor: disabled ? 'inherit' : 'list.hoverBackground',
      },
    })
);
