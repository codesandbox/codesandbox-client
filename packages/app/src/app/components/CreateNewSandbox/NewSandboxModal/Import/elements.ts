import styled, { css } from 'styled-components';

export const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 2rem;
  margin-bottom: 4rem;
  padding: 0 1.5rem;
`;

export const FeatureName = styled.h3`
  font-family: Roboto;
  font-weight: bold;
  font-size: 13px;
  line-height: 16px;
  padding: 0;
  margin: 0;
  color: #ffffff;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  svg {
    margin-right: 1rem;
  }
`;

export const FeatureText = styled.p`
  font-family: Roboto;
  font-size: 13px;
  line-height: 17px;
  margin-top: 0.5rem;
  margin-bottom: 2rem;

  color: #757575;

  small {
    display: block;
    padding-top: 0.75rem;
    font-size: 11px;
  }
`;

export const Column = styled.div<{ fullWidth?: boolean }>`
  border-bottom: 1px solid #242424;
  padding-bottom: 1.5rem;
  ${props =>
    !props.fullWidth &&
    css`
      &:first-of-type {
        padding-right: 1.7rem;
        border-right: 1px solid #242424;
      }

      &:last-of-type {
        padding-left: 1.7rem;
      }
    `}
  ${props =>
    props.fullWidth &&
    css`
      grid-column: span 2;
    `}
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

  button:first-child {
    margin-right: 0.5rem;
  }
`;

export const Input = styled.input`
  padding: 0.5rem;
  background: #222222;
  border: 0.957784px solid #040404;
  box-sizing: border-box;
  border-radius: 2px;
  color: white;
  width: 100%;

  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #757575;
  }
  &::-moz-placeholder {
    /* Firefox 19+ */
    color: #757575;
  }
  &:-ms-input-placeholder {
    /* IE 10+ */
    color: #757575;
  }
`;

export const PlaceHolderLink = styled.span<{ error: string }>`
  transition: 0.3s ease color;

  display: block;
  margin: 1rem 0.25rem;
  margin-left: 0.5rem;

  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;

  font-weight: 500;
  font-size: 1rem;
  ${props =>
    props.error &&
    css`
      color: ${props.theme.red};
    `}
`;

export const ImportChoices = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 60px;
  padding: 0 1.5rem;
  font-family: Inter;
  font-size: 16px;
  margin-bottom: 4rem;

  color: #ffffff;

  a {
    color: #ffffff;
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  svg {
    margin-right: 0.5rem;
  }
`;
