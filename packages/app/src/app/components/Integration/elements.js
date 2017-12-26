import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);

  ${props =>
    props.loading &&
    css`
      opacity: 0.5;
    `};
`;

export const IntegrationBlock = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.bgColor};
  flex: 1;
  color: white;
  font-size: 1.25rem;
  padding: 1rem 1.5rem;
`;

export const Name = styled.span`
  margin-left: 0.75rem;
  font-size: 1.375rem;
`;
