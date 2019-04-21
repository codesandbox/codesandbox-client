import styled from 'styled-components';

export const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 0.5rem;
  padding-right: 2px;
  overflow: hidden;
`;

export const Container = styled.div`
  margin-bottom: 1rem;
  overflow: hidden;

  border-radius: 2px;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  padding: 7px;
  background-color: ${props => props.theme['sideBar.background']};

  font-size: 0.875rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};


  svg {
    transition: 0.3s ease color;
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
