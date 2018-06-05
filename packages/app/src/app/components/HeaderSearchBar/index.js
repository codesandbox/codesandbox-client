import React, { Component } from 'react';
import history from 'app/utils/history';
import { searchUrl } from 'common/utils/url-generator';

import { InstantSearch, PoweredBy } from 'react-instantsearch/dom';
import { connectHits, connectSearchBox } from 'react-instantsearch/connectors';

import {
  Container,
  Input,
  StyledSearchIcon,
  StyledSearchButton,
  ResultContainer,
  ResultItem,
} from './elements';

const Hits = connectHits(({ hits, onClick }) => (
  <ResultContainer>
    {hits.map(hit => (
      <ResultItem key={hit.objectID}>
        <a onClick={() => onClick(hit)}>{hit.path}</a>
      </ResultItem>
    ))}
  </ResultContainer>
));

const Search = connectSearchBox(({ currentRefinement, refine, onChange }) => (
  <Input
    autocomplete="off"
    type="text"
    value={currentRefinement}
    name="q"
    placeholder="Search sandboxes"
    onChange={e => {
      refine(e.target.value);
      onChange(e.target.value);
    }}
  />
));

class HeaderSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = { query: '' };
  }

  onFormSubmit = e => {
    e.preventDefault();

    history.push(searchUrl(this.state.query));
  };

  onSearch = query => {
    this.setState({ query });
  };

  onClick = hit => {
    console.log('open', hit);
  };

  render() {
    return (
      <Container>
        <InstantSearch
          appId="LUO7YFIJKR"
          apiKey="5c5779039af0133516e12a9eb63096cf"
          indexName="prod_code"
        >
          <form onSubmit={this.onFormSubmit}>
            <Search onChange={this.onSearch} />
            <StyledSearchButton>
              <StyledSearchIcon />
            </StyledSearchButton>
          </form>

          {this.state.query.length > 0 ? <Hits onClick={this.onClick} /> : ''}
        </InstantSearch>
      </Container>
    );
  }
}

export default HeaderSearchBar;
