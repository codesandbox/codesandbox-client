import styled, { css } from 'styled-components';

const svg = (hover?: boolean) => css`
  background-image: url("data:image/svg+xml,%3Csvg width='13' height='12' viewBox='0 0 13 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.68564 7.60174C6.95348 8.19679 6.02089 8.55326 5.00532 8.55326C2.65163 8.55326 0.743591 6.63855 0.743591 4.27663C0.743591 1.91471 2.65163 0 5.00532 0C7.35901 0 9.26706 1.91471 9.26706 4.27663C9.26706 5.29574 8.91183 6.2316 8.31886 6.96631L12.7018 11.3646L12.0686 12L7.68564 7.60174ZM8.37155 4.27663C8.37155 6.14224 6.86444 7.65462 5.00532 7.65462C3.14621 7.65462 1.6391 6.14224 1.6391 4.27663C1.6391 2.41102 3.14621 0.898637 5.00532 0.898637C6.86444 0.898637 8.37155 2.41102 8.37155 4.27663Z' fill='${
    hover ? 'white' : '%23757575'
  }'/%3E%3C/svg%3E%0A");
`;

export const Grid = styled.div`
  margin: 0 1.5rem;
  display: grid;
  grid-column-gap: 60px;
  grid-template-columns: 1fr 1fr;
`;

export const Search = styled.input`
  background: #222222;
  border: 1px solid #040404;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 0.5rem;
  padding-left: 30px;
  padding-right: 1.5rem;
  min-width: 286px;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: #ffffff;
  ${svg()}
  background-repeat: no-repeat;
  background-position-x: 0.5rem;
  background-position-y: 50%;
  transition: width 1s ease, border-color 200ms ease;

  &:focus {
    border-color: #ffffff;
    ${svg(true)}
  }

  &::-webkit-input-placeholder {
    color: #757575;
  }
  &::-moz-placeholder {
    color: #757575;
  }
  &:-ms-input-placeholder {
    color: #757575;
  }
`;

export const Form = styled.form`
  display: flex;
  align-items: center;
`;

export const Categories = styled.select`
  appearance: none;
  background: #222222;
  border: 1px solid #040404;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 0.5rem;
  padding-right: 1rem;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 12px;
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='5' viewBox='0 0 6 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.00006 4.40485L1.27146e-07 0.00346194L6 0.00346136L3.00006 4.40485Z' fill='white'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position-x: calc(100% - 0.5rem);
  background-position-y: 50%;
`;

export const InputWrapper = styled.div`
  position: relative;

  &:focus-within {
    :before {
      background-image: url("data:image/svg+xml,%3Csvg width='13' height='12' viewBox='0 0 13 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1.20227' y='0.375' width='11.2083' height='11.25' rx='0.375' stroke='white' stroke-width='0.75'/%3E%3Cpath d='M8.00501 2.71875H7.37219L5.4386 9.90234H6.07141L8.00501 2.71875Z' fill='white'/%3E%3C/svg%3E%0A");
    }
  }

  &::before {
    content: '';
    background-image: url("data:image/svg+xml,%3Csvg width='13' height='12' viewBox='0 0 13 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1.20227' y='0.375' width='11.2083' height='11.25' rx='0.375' stroke='%23757575' stroke-width='0.75'/%3E%3Cpath d='M8.00501 2.71875H7.37219L5.4386 9.90234H6.07141L8.00501 2.71875Z' fill='%23757575'/%3E%3C/svg%3E%0A");
    width: 13px;
    height: 13px;
    top: 9px;
    right: 0.25rem;
    position: absolute;
    background-repeat: no-repeat;
  }
`;
