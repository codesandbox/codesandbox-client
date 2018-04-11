import styled from 'app/styled-components';

export const Container = styled.div`
  min-height: 200px;
  max-height: 300px;
  padding: 0 1rem;
  color: white;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Messages = styled.div`
  height: 100%;
  flex: 1;
`;
