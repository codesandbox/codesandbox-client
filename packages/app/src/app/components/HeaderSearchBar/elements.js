import styled from 'styled-components';
import SearchIcon from 'react-icons/lib/go/search';
import Relative from 'common/components/Relative';

export const Container = styled(Relative)`
  display: flex;
  align-items: center;
  font-weight: 500;
`;

export const Input = styled.input`
  transition: 0.4s ease all;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid transparent;
  outline: none;
  border-radius: 4px;
  width: 10em;
  z-index: 20;
  padding: 0.35em 0.5em;
  padding-right: 1.75em;
  color: white;
  font-weight: 500;

  &::-webkit-input-placeholder {
    font-weight: 500;
  }

  &:focus {
    width: 14em;
  }
`;

export const StyledSearchIcon = styled(SearchIcon)`
  font-size: 0.875em;
  color: rgba(255, 255, 255, 0.7);
`;

export const StyledSearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  padding: 0.35em 0.5em;
  transform: translate(0, -50%);
  z-index: 20;
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
`;

export const ResultContainer = styled.div`
  background: #24282a;
  position: absolute;
  // width: 100%;
  z-index: 10;

  transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s,
    z-index 0s linear 0.01s;
`;

const selectedCss = `
  background-color: rgba(108,174,221,0.09);
  border-color: rgb(38,110,161);
`;

export const ResultItem = styled.div`
  padding: 20px 10px;
  border-left: 2px solid transparent;

  ${({ selected }) => (selected === true ? selectedCss : '')};
`;
