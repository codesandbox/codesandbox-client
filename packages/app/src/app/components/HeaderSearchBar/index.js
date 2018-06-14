import React, { Component } from 'react';
import history from 'app/utils/history';
import { dispatch, actions } from 'codesandbox-api';
import { searchUrl } from 'common/utils/url-generator';
import getType from '../../utils/get-type';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
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

const KEY_CLOSE = 27;
const KEY_OPEN = 13;
const KEY_UP = 38;
const KEY_DOWN = 40;

function getSnippetResult(hit) {
  const snippet = hit._snippetResult.code;

  if (snippet.matchLevel === 'none') {
    return '…';
  }

  return snippet.value;
}

const nameFromPath = n => n.split('/').pop();

const Hits = connectHits(
  class extends Component {
    constructor(props) {
      super(props);

      this.state = this.getInitialState();
    }

    getInitialState = () => ({
      selected: -1, // nothing
    });

    componentDidMount = () => {
      window.addEventListener('keydown', this.onKeyDown);
    };

    onKeyDown = e => {
      if (e.keyCode === KEY_CLOSE) {
        this.props.onCancel();
      }

      if (e.keyCode === KEY_UP) {
        this.setState(({ selected }) => ({
          selected: Math.max(selected - 1, 0),
        }));
      }

      if (e.keyCode === KEY_DOWN) {
        const maxIndex = this.props.hits.length - 1;

        this.setState(({ selected }) => ({
          selected: Math.min(selected + 1, maxIndex),
        }));
      }

      if (e.keyCode === KEY_OPEN) {
        // If an entry has been selected, open it
        if (this.state.selected !== -1) {
          e.preventDefault();
          e.stopPropagation();

          this.openSelected();
        }
      }
    };

    componentWillUnmount = () => {
      window.removeEventListener('keydown', this.onKeyDown);
    };

    select = selected => () => {
      this.setState({ selected });
    };

    openSelected = () => {
      if (this.state.selected === -1) {
        // Nothing was selected
        return;
      }

      const entry = this.props.hits[this.state.selected];

      if (typeof entry !== 'undefined') {
        this.props.onOpen(entry.path);
      }

      this.setState(this.getInitialState);
      this.props.onCancel();
    };

    render() {
      const { hits } = this.props;

      return (
        <ResultContainer>
          {hits.map((hit, i) => (
            <a
              key={hit.objectID}
              onClick={this.openSelected}
              onMouseOver={this.select(i)}
            >
              <ResultItem selected={this.state.selected === i}>
                <div>
                  <EntryIcons type={getType(nameFromPath(hit.path))} />
                  {hit.path}
                </div>

                <pre>
                  <code
                    dangerouslySetInnerHTML={{
                      __html: getSnippetResult(hit),
                    }}
                  />
                </pre>
              </ResultItem>
            </a>
          ))}
        </ResultContainer>
      );
    }
  }
);

const Search = connectSearchBox(({ value, refine, onChange }) => (
  <Input
    autoComplete="off"
    type="text"
    value={value}
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

    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    query: '',
  });

  onFormSubmit = e => {
    e.preventDefault();

    history.push(searchUrl(this.state.query));
  };

  onSearch = query => {
    this.setState({ query });
  };

  onOpen = path => {
    dispatch(actions.editor.openModule(path));
  };

  onCancel = () => {
    this.setState(this.getInitialState);
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

          <form onSubmit={this.onFormSubmit} autoComplete="off">
            <Search onChange={this.onSearch} value={this.state.query} />
            <StyledSearchButton>
              <StyledSearchIcon />
            </StyledSearchButton>
          </form>

          {this.state.query.length > 0 ? (
            <Hits onCancel={this.onCancel} onOpen={this.onOpen} />
          ) : (
            ''
          )}
        </InstantSearch>
      </Container>
    );
  }
}

export default HeaderSearchBar;
