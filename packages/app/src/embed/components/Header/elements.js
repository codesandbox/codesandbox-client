// @flow
import styled, { css } from 'styled-components';
import MenuIconSVG from 'react-icons/lib/md/menu';
import { SIDEBAR_SHOW_SCREEN_SIZE } from '../../util/constants';

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

  @media (min-width: ${SIDEBAR_SHOW_SCREEN_SIZE}px) {
    svg {
      visibility: hidden;
      display: none;
    }
  }
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

export const OnlyShowWideText = styled.div`
  margin-left: 0.5rem;
  @media (max-width: ${props => props.hideOn || 400}px) {
    display: none;
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  font-family: Roboto;
  transition: 0.3s ease all;
  background-color: ${props => props.bgColor || 'rgba(63, 168, 243, 0.1)'};
  border: 1px solid ${props => props.color || 'rgb(64, 169, 243)'};
  font-size: 0.875rem;

  color: ${props => props.color || 'rgb(64, 169, 243)'};
  border-radius: 4px;
  margin-right: 0.5rem;
  padding: 0.4rem 0.4rem;
  text-decoration: none;

  &:last-child {
    margin-right: 0;
  }

  cursor: pointer;

  &:hover {
    background-color: ${props => props.color || 'rgb(64, 169, 243)'};
    color: ${props =>
      props.invertedHover ? props.theme.background2 : 'white'};
  }

  ${props =>
    props.hideSmall &&
    css`
      @media (max-width: ${props.hideSmall}px) {
        display: none;
      }
    `};

  @media (max-width: 486px) {
    height: 100%;
    border: 0;
    margin-right: -1rem;
    &:last-child {
      margin-right: -1rem;
    }
    padding: 0 1rem;
    border-radius: 0;
    font-size: 1.5rem;
    background-color: transparent;
  }
`;
