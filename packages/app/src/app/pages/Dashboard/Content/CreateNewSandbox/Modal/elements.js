import styled, { css } from 'styled-components';
import delayEffect from 'common/utils/animation/delay-effect';
import delayOutEffect from 'common/utils/animation/delay-out-effect';

export const Container = styled.main`
  transition: 0.3s ease all;
  background-color: ${props => props.theme.background};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 4px;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;

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
  transition: 0.15s ease opacity;
  ${delayEffect(0.3)};

  ${props =>
    (props.closing || props.forking) &&
    css`
      position: absolute;
      overflow: hidden;
      ${delayOutEffect(0)};
    `};
`;

export const Title = styled.h2`
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  margin-top: 1rem;

  &:first-child {
    margin-top: 0;
  }
`;

export const Templates = styled.div`
  display: flex;
  align-items: center;

  ${props =>
    props.small &&
    css`
      font-size: 0.8rem;
    `};
  @media (max-width: 870px) {
    flex-wrap: wrap;
  }
`;

export const ImportChoices = styled(Templates)`
  justify-content: space-between;
  margin-top: 1.5rem;
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
