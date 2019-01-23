import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  background-color: ${props =>
    props.theme['titleBar.activeBackground'] || props.theme.background2};
  font-size: 1.2rem;
  color: ${props =>
    props.theme['titleBar.activeForeground'] || 'rgba(255, 255, 255, 0.7)'};
  margin: 0;
  height: 3rem;
  font-weight: 400;
  flex: 0 0 3rem;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid
    ${props =>
      props.theme['titleBar.activeForeground']
        ? props.theme['titleBar.border'] || 'transparent'
        : props.theme.background2.darken(0.3)};
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const Left = styled.div`
  display: flex;
  height: 100%;
`;

export const Centered = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
`;
