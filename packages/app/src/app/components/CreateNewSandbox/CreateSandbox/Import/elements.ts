import styled from 'styled-components';

import { InfoIcon } from '../Icons';

export const Features = styled.section`
  margin: 2em auto;
  text-align: center;
  max-width: 370px;

  @media screen and (max-width: 800px) {
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

export const FeatureText = styled.p`
  font-family: 'Roboto';
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 30px;

  color: #757575;

  small {
    display: block;
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

export const PlaceHolderLink = styled.span`
  transition: 0.3s ease color;

  display: block;
  margin: 1rem 0.25rem;
  margin-left: 0.5rem;

  color: ${props => props.theme.red};
  text-decoration: none;
`;

export const ImportChoices = styled.div`
  display: flex;
  justify-content: space-around;
  transition: 0.3s ease color;

  font-family: Inter;
  font-size: 16px;
  color: #fff;

  border-top: 1px solid #242424;
  padding: 2em 0;

  @media screen and (max-width: 800px) {
    font-size: 13px;
  }

  a {
    transition: 0.3s ease color;
    color: #fff;
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
