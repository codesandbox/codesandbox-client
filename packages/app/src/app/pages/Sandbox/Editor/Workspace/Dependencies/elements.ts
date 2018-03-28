import styled from 'app/styled-components';

export const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  padding: 1rem;
  padding-top: 0;
  font-size: 0.875rem;
`;

export const Link = styled.a.attrs({
  rel: 'noopener noreferrer',
  target: '_blank',
})`
  color: ${props => props.theme.templateColor || props.theme.secondary};
  text-decoration: none;
`;
