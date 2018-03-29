import styled from 'app/styled-components';
import UserWithAvatar from 'app/components/UserWithAvatar';

export const CenteredText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const UpdatedAt = styled.em`
  font-size: 0.75rem;
`;

export const Stats = styled.div`
  position: absolute;
  right: 0;

  font-size: 0.875rem;
  display: flex;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const StyledUser = styled(UserWithAvatar)`
  font-size: 0.75rem;
`;
