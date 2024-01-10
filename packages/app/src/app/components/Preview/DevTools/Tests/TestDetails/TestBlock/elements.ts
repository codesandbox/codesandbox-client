import styled from 'styled-components';
import Color from 'color';

export const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0rem 1rem;

  overflow: hidden;
  background-color: ${props =>
    Color(props.theme['sideBar.background'])
      .darken(props.theme.light ? 0.1 : 0.3)
      .toString()};
`;

export const Container = styled.div`
  margin-bottom: 0.75rem;
  overflow: hidden;

  border-radius: 2px;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  padding: 7px;
  padding-right: 0;

  font-size: 0.875rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};

  svg {
    transition: 0.3s ease opacity;
    margin-right: 1rem;
    font-size: 1.125rem;
    cursor: pointer;
    color: ${props => props.theme['button.hoverBackground']};
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
`;
