import styled from 'styled-components';

export const UpdateMessage = styled.div`
  color: white;
  border-radius: 2px;
  font-size: 0.75rem;
  width: 100px;
  text-align: center;
  padding: 0.5rem 0.75rem;

  cursor: pointer;

  &::after {
    content: 'Update Available!';
  }

  &:hover {
    &::after {
      content: 'Click to Refresh';
    }
  }
`;

export const UpdateContainer = styled.div`
  cursor: pointer;

  &:hover {
    > #update-message {
      &::after {
        content: 'Click to Refresh' !important;
      }
    }
  }
`;
