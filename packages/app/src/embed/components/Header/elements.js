// @flow
import styled, { css } from 'styled-components';
import MenuIconSVG from 'react-icons/lib/md/menu';
import RealButton from 'app/components/Button';

import { SIDEBAR_SHOW_SCREEN_SIZE } from '../../util/constants';

export const CodeSandboxButton = styled(RealButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 138px;
  padding: 0.4em 0.7em;

  @media (max-width: 510px) {
    padding: 0.2em;
    background-color: transparent;
    border-color: transparent;

    width: auto;
    font-size: 1.4rem;
  }
`;

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

export const OnlyShowWideText = styled.span`
  margin-left: 0.4rem;
  @media (max-width: ${props => props.hideOn || 400}px) {
    display: none;
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  font-family: Roboto;
  transition: 0.3s ease all;
  background-color: transparent;
  border: transparent;
  font-size: 0.875rem;
  font-weight: 500;

  color: ${props => props.color || 'rgb(64, 169, 243)'};
  border-radius: 4px;
  margin-right: 0.75rem;
  padding: 0.4rem 0.4rem;
  text-decoration: none;
  cursor: pointer;

  svg {
    margin-right: 0.1rem;
  }

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
