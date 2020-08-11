import styled, { css } from 'styled-components';

import { InfoIcon } from '../Icons';

export const Features = styled.section`
  display: flex;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #242424;

  @media screen and (max-width: 800px) {
    display: block;

    hr {
      display: none;
    }

    > div:first-child {
      margin-bottom: 80px;
    }

    > div:last-child {
      padding-top: 20px;
      border-top: 1px solid #242424;
    }
  }
`;

export const FeatureName = styled.h3`
  font-family: Inter;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  padding: 0;
  margin: 0;
  color: #ffffff;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
`;

export const FeatureText = styled.p`
  font-family: Roboto;
  font-size: 13px;
  line-height: 17px;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;

  color: #757575;

  small {
    display: block;
    padding-top: 0.75rem;
    font-size: 11px;
  }
`;

export const IconLink = styled.a.attrs({
  target: '_blank',
  rel: 'noreferrer noopener',
})`
  display: flex;
  align-items: center;
`;

export const StyledInfoIcon = styled(InfoIcon)`
  font-size: 0.75em;
  margin-left: 0.5rem;
`;

export const Column = styled.div``;

export const VerticalSeparator = styled.hr`
  height: auto;
  width: 1px;
  min-width: 1px;
  margin: 0 1rem;
  border: 0;
  outline: 0;

  background-color: #242424;
`;

export const Button = styled.button`
  background: #040404;
  border-radius: 2px;
  border: none;
  color: white;
  padding: 0.5rem;
  font-size: 10px;
  margin: 0;
  opacity: 1;
  transition: opacity 200ms ease;

  &:disabled {
    opacity: 0.4;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: 0.5rem;
  float: right;
  margin-bottom: 1rem;

  button:first-child {
    margin-right: 0.5rem;
  }
`;

const linkStyles = css`
  transition: 0.3s ease color;

  display: block;
  margin: 1rem 0.25rem;
  margin-left: 0.5rem;

  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;

  font-weight: 500;
  font-size: 13px;
`;

export const PlaceHolderLink = styled.span<{ error: string }>`
  ${linkStyles};

  ${props =>
    props.error &&
    css`
      color: ${props.theme.red};
    `}
`;

export const GitHubLink = styled.a`
  ${linkStyles};
  word-break: break-all;
  s &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const ImportChoices = styled.div`
  transition: 0.3s ease color;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 60px;
  padding: 0 1.5rem;
  font-family: Inter;
  font-size: 16px;
  margin-bottom: 4rem;
  color: #757575;

  @media screen and (max-width: 800px) {
    font-size: 13px;
  }

  a {
    transition: 0.3s ease color;
    color: #757575;
    display: flex;
    align-items: center;
    text-decoration: none;

    &:hover,
    &:focus {
      color: white;
    }
  }

  svg {
    margin-right: 0.5rem;

    @media screen and (max-width: 800px) {
      display: none;
    }
  }
`;
