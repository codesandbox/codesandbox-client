import styled, { css } from 'styled-components';
import delay from '@codesandbox/common/lib/utils/animation/delay-effect';

export const Status = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const UserContainer = styled.div<{ isCurrentUser: boolean }>`
  ${({ isCurrentUser, theme }) => css`
    ${delay()};
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    ${isCurrentUser &&
      css`
        color: white;
      `};

    &:first-child {
      margin-top: 0;
    }
  `}
`;

export const ProfileImage = styled.img<{ borderColor: string }>`
  ${({ borderColor }) => css`
    width: 26px;
    height: 26px;
    border-radius: 2px;
    border-left: 2px solid ${borderColor};

    margin-right: 0.5rem;
  `}
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`;
