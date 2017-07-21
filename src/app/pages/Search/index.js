import React from 'react';
import styled from 'styled-components';
import { InstantSearch, SearchBox, PoweredBy } from 'react-instantsearch/dom';

import Title from 'app/components/text/Title';
import MaxWidth from 'app/components/flex/MaxWidth';
import Margin from 'app/components/spacing/Margin';
import Row from 'app/components/flex/Row';

import Navigation from 'app/containers/Navigation';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from 'app/utils/config';

import './Search.css';
import Results from './Results';
import Filters from './Filters';

const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: white;
`;

const StyledTitle = styled(Title)`
  display: inline-block;
  text-align: left;
  font-size: 2rem;
`;

const SEARCHABLE_THINGS = [
  'dependency',
  'user',
  'sandbox title',
  'sandbox tag',
  'github repository',
];

const getRandomSearch = () =>
  SEARCHABLE_THINGS[Math.floor(Math.random() * SEARCHABLE_THINGS.length)];

export default () => {
  document.title = 'Search - CodeSandbox';
  return (
    <MaxWidth>
      <Margin vertical={1.5} horizontal={1.5}>
        <Navigation title="Search" />
        <Content>
          <MaxWidth width={1024}>
            <InstantSearch
              appId={ALGOLIA_APPLICATION_ID}
              apiKey={ALGOLIA_API_KEY}
              indexName={ALGOLIA_DEFAULT_INDEX}
            >
              <StyledTitle>Sandbox Search</StyledTitle>
              <PoweredBy />
              <SearchBox
                translations={{
                  placeholder: `Search for a ${getRandomSearch()}...`,
                }}
              />
              <Row alignItems="flex-start">
                <Results />
                <Filters />
              </Row>
            </InstantSearch>
          </MaxWidth>
        </Content>
      </Margin>
    </MaxWidth>
  );
};
