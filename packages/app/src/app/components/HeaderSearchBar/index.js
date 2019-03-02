import React from 'react';
import history from 'app/utils/history';
import { searchUrl } from 'common/lib/utils/url-generator';

import {
  Container,
  Input,
  StyledSearchIcon,
  StyledSearchButton,
} from './elements';

function HeaderSearchBar() {
  const handleFormSubmit = e => {
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
}

export default HeaderSearchBar;
