import React from 'react';
import styled from 'styled-components';
import SearchIcon from 'react-icons/lib/go/search';

import history from 'app/utils/history';

import Relative from './Relative';
import { searchUrl } from '../utils/url-generator';

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
  position: absolute;
  right: 0.5em;
  font-size: .875em;
`;

export default class HeaderSearchBar extends React.PureComponent {
  state = {
    query: '',
  };

  handleChange = e => {
    this.setState({ query: e.target.value });
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter
      history.push(searchUrl(this.state.query));
    }
  };

  render() {
    return (
      <Container>
        <Input
          onChange={this.handleChange}
          placeholder="Search sandboxes"
          onKeyUp={this.handleKeyUp}
        />
        <StyledSearchIcon value={this.state.query} />
      </Container>
    );
  }
}
