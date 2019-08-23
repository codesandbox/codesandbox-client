import styled from 'styled-components';

export const ButtonContainer = styled.div`
  margin: 0.5rem 1rem;
`;

export const Fonts = styled.ul`
  position: absolute;
  margin: 0;
  list-style: none;
  padding: 0;
  margin-left: 1rem;
  background-color: ${props => props.theme['sideBar.background']};
  width: 100%;
  padding-left: 0.25rem;
`;

export const Font = styled.li`
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
  margin-bottom: 0.25rem;
`;

export const FontName = styled.button`
  appearance: none;
  border: none;
  padding: 0;
  border: none;
  background: transparent;
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
`;
