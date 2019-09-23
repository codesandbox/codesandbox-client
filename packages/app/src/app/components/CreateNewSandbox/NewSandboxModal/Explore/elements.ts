import styled from 'styled-components';

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
  min-width: 286px;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: #ffffff;

  &:focus {
    border-color: #ffffff;
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

export const Categories = styled.select`
  appearance: none;
`;
