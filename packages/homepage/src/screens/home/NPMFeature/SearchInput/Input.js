import React from 'react';
import styled from 'styled-components';

import Relative from 'common/components/Relative';

import SearchIcon from 'react-icons/lib/md/search';

const Input = styled.input`
  transition: 0.3s ease box-shadow;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;

  padding-left: 2.5rem;
  font-size: 1.125rem;

  margin-bottom: 2rem;

  box-shadow: 0 0 100px rgba(255, 255, 255, 0.3);

  &:focus {
    box-shadow: 0 0 140px rgba(255, 255, 255, 0.5);
  }
`;

const Icon = styled(SearchIcon)`
  position: absolute;
  left: 0.5rem;
  top: 0.55rem;
  font-size: 1.5rem;
  color: rgba(0, 0, 0, 0.5);
`;

export default class SearchInput extends React.PureComponent {
  state = {
    query: '',
  };

  onChange = e => {
    this.setState({ query: e.target.value });
    this.props.searchQuery(e.target.value);
  };

  render() {
    return (
      <Relative>
        <Input
          placeholder="Search for a dependency"
          value={this.state.query}
          onChange={this.onChange}
        />
        <Icon />
      </Relative>
    );
  }
}
