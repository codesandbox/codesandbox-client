import styled from 'styled-components';

export const BorderRadius = styled.div<{ hasUrl?: boolean }>`
  display: flex;
  transition: 0.3s ease all;
  border-radius: 4px;
  margin-right: 1rem;
  align-items: center;

  display: flex;
`;

export const Text = styled.span`
  display: inline-block;

  color: ${props => (props.theme.light ? 'black' : 'white')};
  word-wrap: break-word;
`;

export const Icon = styled.span`
  display: inline-block;
  margin-right: 0.5rem;
  border-radius: 2px;
  color: ${props => props.theme['editor.foreground']};
  font-size: 1.25em;
`;

export const StyledA = styled.a`
  text-decoration: none;
`;
