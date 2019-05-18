import styled, { css } from 'styled-components';
import delayEffect from '@codesandbox/common/lib/utils/animation/delay-effect';
import delayOutEffect from '@codesandbox/common/lib/utils/animation/delay-out-effect';

export const Container = styled.main`
  transition: 0.3s ease all;
  background-color: ${props => props.theme.background};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 0 0 4px 4px;
  width: 100%;
  box-sizing: border-box;
  position: relative;

  ${props =>
    props.closing &&
    css`
      position: relative;
      pointer-events: none;
      height: calc(100% - 2rem);
      width: calc(100% - 2rem);
      border: 2px solid ${props.theme.secondary.clearer(0.2)};
      border-style: dashed;
      background-color: ${props.theme.secondary.clearer(0.9)};
      overflow: hidden;
    `};

  ${props =>
    props.forking &&
    css`
      height: 100%;
      overflow: hidden;
    `};
`;

export const TabContainer = styled.div`
  width: 100%;
  border-radius: 4px 4px 0 0;
  display: flex;
  background: #1b1d1f;
  height: 62px;
  box-sizing: border-box;
  padding: 0 2rem;

  ${props =>
    (props.closing || props.forking) &&
    css`
      position: absolute;
      overflow: hidden;
      ${delayOutEffect(0)};
    `};
`;

export const InnerContainer = styled.div`
  padding: 2rem;
  overflow: hidden;
  ${props =>
    (props.closing || props.forking) &&
    css`
      position: absolute;
      overflow: hidden;
      padding: 0;
      ${delayOutEffect(0)};
    `};
`;

export const Templates = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const ImportChoices = styled.div`
  margin-top: 2.5em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  ${delayEffect(0.1)};
`;

export const Tab = styled.section`
  display: ${props => (props.visible ? 'block' : 'none')};
  transition: 0.15s ease opacity;
  ${delayEffect(0.1)};
`;

export const ImportChoice = styled.a`
  transition: 0.2s ease color;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 1.25em;
  margin-top: 0.2rem;

  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
  }

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const activeStyles = css`
  color: white;
  padding-bottom: 0;
  padding-top: 0;
  outline: none;

  &:after {
    width: 110%;

    @media screen and (max-width: 500px) {
      width: 100%;
    }
  }
`;

export const Button = styled.button`
  background: transparent;
  font-family: 'Roboto', sans-serif;
  border: none;
  margin: 0;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: ${props => (props.selected ? 'white' : 'rgba(255, 255, 255, 0.5)')};
  padding: 0 20px;
  transition: 0.15s ease all;
  position: relative;
  cursor: pointer;
  ${delayEffect(0.1)};

  &:after {
    content: '';
    margin-top: 21px;
    display: block;
    position: relative;
    background: #40a9f3;
    height: 2px;
    box-sizing: border-box;
    width: 0%;
    margin-left: -5%;
    transition: all 200ms ease;

    @media screen and (max-width: 500px) {
      margin-left: 0%;
    }
  }

  ${props =>
    props.selected &&
    css`
      ${activeStyles};
    `};

  &:hover {
    ${activeStyles};
  }
`;

export const Title = styled.h2`
  grid-column: 1/-1;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0;
  margin-top: 1rem;
  &:first-child {
    margin-top: 0;
  }
`;
