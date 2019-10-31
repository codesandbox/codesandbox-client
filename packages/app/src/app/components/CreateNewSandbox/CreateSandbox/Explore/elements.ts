import styled, { createGlobalStyle } from 'styled-components';
import { Pagination as BasePagination } from '@codesandbox/common/lib/components/Pagination';

export const GlobalSearchStyles = createGlobalStyle`
.ais-InstantSearch__root {
  display: flex;
  flex-direction: column;
  height: 496px;
}
`;

export const Results = styled.div`
  display: grid;
  grid-template-rows: min-content auto min-content;
`;

export const Grid = styled.div`
  margin: 0 1.5rem;
  display: grid;
  grid-column-gap: 60px;
  grid-template-columns: 1fr 1fr;
  align-content: start;
`;

export const Pagination = styled(BasePagination)`
  justify-self: center;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
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
  padding: 0.25rem;
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
    top: 5px;
    right: 0.5rem;
    position: absolute;
    background-repeat: no-repeat;
  }
`;
