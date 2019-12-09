import styled from 'styled-components';

export const Container = styled.div`
  padding: 1rem;
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
  box-sizing: border-box;
  max-height: 100%;
  overflow: auto;
`;

export const Title = styled.h1`
  display: inline-block;
  font-weight: 600;
  font-size: 1.25rem;
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 1rem;
  flex: 1;
`;

export const Description = styled.p`
  font-size: 1;
  line-height: 1.4;
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
`;
