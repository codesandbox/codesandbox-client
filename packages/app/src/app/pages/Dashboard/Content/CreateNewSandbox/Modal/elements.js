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
  padding: 2rem;
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

export const InnerContainer = styled.div`
  ${props =>
    (props.closing || props.forking) &&
    css`
      position: absolute;
      overflow: hidden;
      ${delayOutEffect(0)};
    `};
`;

export const Templates = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ImportChoices = styled(Templates)`
  justify-content: space-between;
  margin-top: 2.5em;
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
  font-size: 1.125rem;
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

export const Button = styled.button`
  background: transparent;
  border: none;
  margin: 0;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 20px;
  padding-bottom: ${props => (props.selected ? '16px' : '20px')};
  border-bottom: ${props => (props.selected ? '4px solid #40a9f3' : 'none')};
  transition: 0.15s ease opacity;
  top: -10px;
  position: relative;
  cursor: pointer;
  ${delayEffect(0.1)};

  &:hover {
    /* border-bottom: 4px solid #40a9f35c;
    padding-bottom: 16px; */
  }

  &:focus {
    outline: none;
    border-bottom: 4px solid #40a9f3;
    padding-bottom: 16px;
  }
`;

export const TabContainer = styled.div`
  width: 100%;
  border-radius: 4px 4px 0 0;
  display: flex;
  background: #1b1d1f;
  padding: 0;
  box-sizing: border-box;
  padding: 0 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;
