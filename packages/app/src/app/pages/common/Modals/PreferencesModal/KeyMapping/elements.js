import styled from 'styled-components';

export const Rule = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 0.5rem 0;

  background-color: rgba(255, 255, 255, 0.1);
`;

export const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: ${props => props.theme.red};
  font-weight: 500;
`;
