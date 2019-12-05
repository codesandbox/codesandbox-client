import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided } from 'react-instantsearch-core';
import { SearchBox } from '../../SearchBox';

const Search = ({ currentRefinement, refine }: SearchBoxProvided) => (
  <SearchBox onChange={e => refine(e.target.value)} value={currentRefinement} />
);

export const ExploreSearch = connectSearchBox(Search);
