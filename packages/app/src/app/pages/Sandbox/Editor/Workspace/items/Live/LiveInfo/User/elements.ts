import delay from '@codesandbox/common/lib/utils/animation/delay-effect';
import styled, { css } from 'styled-components';

export const ProfileImage = styled.img<{ borderColor: string }>`
  width: 26px;
  height: 26px;
  border-radius: 2px;
  border-left: 2px solid ${({ borderColor }) => borderColor};

  margin-right: 0.5rem;
`;

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
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};

    ${isCurrentUser &&
      css`
        color: white;
      `};

    &:first-child {
      margin-top: 0;
    }
  `};
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`;

export const UserNameContainer = styled.div`
  flex: 1;
`;
