import React, { Component } from 'react';
import history from 'app/utils/history';
import { dispatch, actions } from 'codesandbox-api';
import { searchUrl } from 'common/utils/url-generator';
import {
  CODE_SEARCH_ALGOLIA_API_KEY,
  CODE_SEARCH_ALGOLIA_APPLICATION_ID,
  CODE_SEARCH_ALGOLIA_DEFAULT_INDEX,
} from 'common/utils/config';

import { Configure, InstantSearch, PoweredBy } from 'react-instantsearch/dom';
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
        <a onClick={() => onClick(hit)}>
          {hit.path}

          <pre>
            <code
              dangerouslySetInnerHTML={{
                __html: hit._snippetResult.code.value,
              }}
            />
          </pre>
        </a>
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

  onClick = ({ path }) => {
    dispatch(actions.editor.openModule(path));
  };

  render() {
    return (
      <Container>
        <InstantSearch
          appId={CODE_SEARCH_ALGOLIA_APPLICATION_ID}
          apiKey={CODE_SEARCH_ALGOLIA_API_KEY}
          indexName={CODE_SEARCH_ALGOLIA_DEFAULT_INDEX}
        >
          <Configure facetFilters={['sandboxId:' + this.props.sandboxId]} />

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
