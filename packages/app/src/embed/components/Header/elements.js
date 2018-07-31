// @flow
import styled from 'styled-components';
import MenuIconSVG from 'react-icons/lib/md/menu';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background.darken(0.3)};
  background-color: ${props => props.theme.background};
`;

export const MenuIcon = styled(MenuIconSVG)`
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 1rem;
  cursor: pointer;
  z-index: 10;
`;

export const LeftAligned = styled.div`
  position: relative;
  display: flex;
  width: calc(50% - 100px);
  height: 100%;
  align-items: center;
  justify-content: flex-start;
`;
export const CenterAligned = styled.div`
  position: relative;
  display: flex;
  width: 200px;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const RightAligned = styled.div`
  position: relative;
  display: flex;
  width: calc(50% - 100px);
  height: 100%;
  align-items: center;
  justify-content: flex-end;
`;

export const Title = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;

  @media (max-width: 450px) {
    display: none;
  }
`;
