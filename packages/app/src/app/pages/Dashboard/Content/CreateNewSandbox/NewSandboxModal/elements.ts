import styled, { css } from 'styled-components';
import delayEffect from '@codesandbox/common/lib/utils/animation/delay-effect';
import delayOutEffect from '@codesandbox/common/lib/utils/animation/delay-out-effect';

export const Container = styled.main<{
  closing: boolean;
  forking: boolean;
}>`
  ${({ closing, forking, theme }) => css`
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 0 0 4px 4px;
    background-color: ${theme.background};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    transition: 0.3s ease all;
    box-sizing: border-box;

    ${closing &&
      css`
        position: relative;
        width: calc(100% - 2rem);
        height: calc(100% - 2rem);
        border: 2px solid ${theme.secondary.clearer(0.2)};
        border-style: dashed;
        background-color: ${theme.secondary.clearer(0.9)};
        overflow: hidden;
        pointer-events: none;
      `};

    ${forking &&
      css`
        height: 100%;
        overflow: hidden;
      `};
  `}
`;

export const TabContainer = styled.div<{
  closing: boolean;
  forking: boolean;
}>`
  ${({ closing, forking, theme }) => css`
    display: flex;
    align-items: flex-start;
    width: 100%;
    border-radius: 8px 8px 0 0;
    background: ${theme.background2};
    box-sizing: border-box;

    ${(closing || forking) &&
      css`
        position: absolute;
        overflow: hidden;
        ${delayOutEffect(0)};
      `};
  `}
`;

export const InnerContainer = styled.div<{
  closing: boolean;
  forking: boolean;
}>`
  ${({ closing, forking }) => css`
    padding: 2rem;
    overflow-y: auto;

    ${(closing || forking) &&
      css`
        position: absolute;
        overflow: hidden;
        padding: 0;
        ${delayOutEffect(0)};
      `};
  `}
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-top: 2.5em;
  ${delayEffect(0.1)};
`;

export const Tab = styled.section<{ visible: boolean }>`
  ${({ visible }) => css`
    display: ${visible ? 'block' : 'none'};
    transition: 0.15s ease opacity;
  `}
`;

export const ImportChoice = styled.a.attrs({
  target: '_blank',
})`
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.25em;
  font-weight: 300;
  text-decoration: none;
  transition: 0.2s ease color;

  svg {
    margin-right: 0.5rem;
  }

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const activeStyles = css`
  ${({ theme }) => css`
    background: ${theme.background};
    color: white;
  `}
`;

export const Button = styled.button<{
  selected: boolean;
}>`
  ${({ selected, theme }) => css`
    position: relative;
    padding: 1rem 2rem;
    margin: 0;
    border: none;
    background: ${theme.background2};
    color: rgba(255, 255, 255, 0.5);
    font-family: 'Roboto', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    transition: 0.15s ease all;
    cursor: pointer;

    ${selected &&
      css`
        ${activeStyles};
      `};

    &:focus {
      outline: none;
      color: white;
    }
    &:hover {
      color: white;
    }
  `}
`;

export const Title = styled.h2`
  grid-column: 1/-1;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;

  &:first-child {
    margin-top: 0;
  }
`;

export const ImportWizardContainer = styled.div`
  display: flex;

  section {
    margin-right: 1rem;
    margin-left: 1rem;
  }

  section:first-child {
    margin-left: 0;
  }

  section:last-child {
    margin-right: 0;
  }
`;
