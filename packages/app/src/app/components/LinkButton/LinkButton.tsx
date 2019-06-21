import styled from 'styled-components';

export const LinkButton = styled.button`
  transition: 0.3s ease color;
  display: inline-block;
  padding: 0;
  margin: 0;
  background-color: transparent;
  border: none;
  outline: none;

  color: ${props => props.theme.secondary};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.secondary.lighten(0.1)};
  }
`;
