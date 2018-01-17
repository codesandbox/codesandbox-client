import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.theme.background};
  font-family: Menlo, monospace;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 2rem);
`;

export const Messages = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
`;

export const IconContainer = styled.div`
  display: inline-flex;
  padding: 0.5rem 0;
  width: 24px;
  align-items: center;
  justify-content: center;
`;
