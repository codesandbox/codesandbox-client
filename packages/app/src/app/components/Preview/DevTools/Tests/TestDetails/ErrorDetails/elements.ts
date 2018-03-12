import styled from 'app/styled-components';

export const Container = styled.div`
  font-family: Menlo, Source Code Pro, monospace;
  padding: 1rem;

  font-size: 0.875rem;
  line-height: 1.6;

  color: rgba(255, 255, 255, 0.8);

  background-color: rgba(0, 0, 0, 0.5);

  white-space: pre-wrap;

  border-bottom: 1px solid rgba(0, 0, 0, 0.5);

  &:last-child {
    border-bottom: none;
  }
`;
