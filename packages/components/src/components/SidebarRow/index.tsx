import styled from 'styled-components';
import css from '@styled-system/css';
import { Stack } from '../Stack';

export const SidebarRow = styled(Stack).attrs({
  align: 'center',
})(
  css({
    height: 8,
  })
);
