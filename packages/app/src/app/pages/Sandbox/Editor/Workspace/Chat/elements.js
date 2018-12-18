import styled from 'styled-components';

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

export const Name = styled.div`
  color: ${props => props.color};
  font-weight: 600;
  margin-bottom: 0.25rem;
  margin-top: 0.5rem;
`;

export const Message = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  margin-bottom: 0.25rem;
`;

export const NoMessages = styled.div`
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
`;
