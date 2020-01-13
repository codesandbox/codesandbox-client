import styled, { css } from 'styled-components';
import { Avatar as BaseAvatar } from '@codesandbox/common/lib/components';

export const Avatar = styled(BaseAvatar)(
  ({ theme }) => css`
    margin-left: 1rem;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 2px solid ${theme.secondary};

    img {
      border: none;
    }
  `
);
