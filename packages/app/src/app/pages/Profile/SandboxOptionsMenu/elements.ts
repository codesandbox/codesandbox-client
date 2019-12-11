import styled from 'styled-components';
import { Menu as BaseMenu } from '@codesandbox/common/lib/components';

export const Menu = styled(BaseMenu)`
  flex: 0 0 auto;

  svg {
    color: #757575;
    font-size: 32px;

    &:hover,
    &:focus {
      color: #fff;
    }
  }
`;
