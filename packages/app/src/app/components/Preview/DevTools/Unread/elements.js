import styled from 'styled-components';

export const Container = styled.div`
  transition: 0.3s ease all;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;

  margin-left: 0.25rem;

  border-radius: 50%;
  height: 16px;
  width: 16px;

  color: ${({ unread }) =>
    unread === 0 ? `rgba(255, 255, 255, 0.4)` : 'white'};
  background-color: ${({ status, unread, theme }) => {
    if (unread === 0) {
      return 'rgba(255, 255, 255, 0.2)';
    }

    if (status === 'info') {
      return theme.secondary();
    } else if (status === 'warning') {
      return theme.primary.darken(0.3)();
    } else if (status === 'error') {
      return theme.red();
    } else if (status === 'success') {
      return theme.green();
    }

    return 'black';
  }};
`;
