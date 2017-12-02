import React from 'react';
import styled from 'styled-components';
import SearchIcon from 'react-icons/lib/go/search';

import history from 'app/utils/history';
import { searchUrl } from 'common/utils/url-generator';

import Relative from 'common/components/Relative';

const Container = styled(Relative)`
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const Input = styled.input`
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

const StyledSearchIcon = styled(SearchIcon)`
  font-size: 0.875em;
  color: rgba(255, 255, 255, 0.7);
`;

const StyledSearchButton = styled.button`
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

const HeaderSearchBar = () => {
  const handleFormSubmit = (e: KeyboardEvent) => {
    e.preventDefault();
    const searchQuery = e.target.elements.q.value;
    history.push(searchUrl(searchQuery));
  };

  return (
    <Container>
      <form onSubmit={handleFormSubmit}>
        <Input name="q" placeholder="Search sandboxes" />
        <StyledSearchButton>
          <StyledSearchIcon />
        </StyledSearchButton>
      </form>
    </Container>
  );
};

export default HeaderSearchBar;
