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
    height: 8,
    paddingX: 2,
  })
);

export const ListAction = styled(ListItem)(
  css({
    ':hover': {
      cursor: 'pointer',
      backgroundColor: 'sideBar.hoverBackground',
    },
    ':focus-within': {
      backgroundColor: 'sideBar.hoverBackground',
    },
  })
);
