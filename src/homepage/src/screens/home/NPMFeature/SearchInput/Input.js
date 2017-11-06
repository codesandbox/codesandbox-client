import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  transition: 0.3s ease all;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1.125rem;

  margin-bottom: 2rem;

  /* border: 2px solid ${({ theme }) => theme.secondary.clearer(0.3)}; */

  /* background-color: rgba(0, 0, 0, 0.3); */
  /* color: rgba(255, 255, 255, 0.8); */
  box-shadow: 0 0 100px rgba(255, 255, 255, 0.3);

  &:focus {
    box-shadow: 0 0 140px rgba(255, 255, 255, 0.5);
  }
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
      <Input
        placeholder="Search for a dependency"
        value={this.state.query}
        onChange={this.onChange}
      />
    );
  }
}
