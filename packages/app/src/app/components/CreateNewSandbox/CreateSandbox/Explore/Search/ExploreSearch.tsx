import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided } from 'react-instantsearch-core';
import { SearchElement } from './elements';

type ForwardedRefProps = {
  forwardedRef: React.Ref<HTMLInputElement>;
};

type SearchProps = SearchBoxProvided & ForwardedRefProps;

const Search = ({ currentRefinement, refine, forwardedRef }: SearchProps) => (
  <form noValidate action="" role="search">
    <SearchElement
      placeholder="Search"
      ref={forwardedRef}
      value={currentRefinement}
      onChange={event => refine(event.currentTarget.value)}
      type="search"
    />
  </form>
);

const ConnectedSearch = connectSearchBox(Search) as React.ComponentClass<
  ForwardedRefProps
>;

export const ExploreSearch = React.forwardRef(
  (props, ref: React.Ref<HTMLInputElement>) => (
    <ConnectedSearch forwardedRef={ref} />
  )
);
