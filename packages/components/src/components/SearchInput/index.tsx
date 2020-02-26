import css from '@styled-system/css';
import React, { ComponentProps, FunctionComponent } from 'react';
import styled from 'styled-components';

import { Element, Input } from '../..';

const SearchInputComponent = styled(Input).attrs({ type: 'search' })(
  css({
    paddingLeft: 5,

    '::-ms-clear, ::-ms-reveal': {
      display: 'none',
      width: 0,
      height: 0,
    },

    '::-webkit-search-cancel-button': {
      display: 'none',
    },
  })
);

const SearchIconBase = () => (
  <svg fill="none" width="12" height="12">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.966 7.932a4.15 4.15 0 01-2.69.993C1.916 8.925 0 6.927 0 4.463 0 1.998 1.915 0 4.277 0s4.276 1.998 4.276 4.463c0 1.063-.356 2.04-.951 2.806L12 11.86l-.635.663-4.399-4.59zm.689-3.47c0 1.947-1.513 3.525-3.378 3.525C2.41 7.987.899 6.41.899 4.463.899 2.516 2.41.938 4.277.938c1.865 0 3.378 1.578 3.378 3.525z"
    />
  </svg>
);

const SearchIcon = styled(SearchIconBase)(
  css({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 1,

    path: {
      fill: 'input.placeholderForeground',
    },
  })
);

type Props = Omit<ComponentProps<typeof SearchInputComponent>, 'children'>;
export const SearchInput: FunctionComponent<Props> = props => (
  <>
    <Element css={{ position: 'relative' }}>
      <SearchIcon />

      <SearchInputComponent {...props} />
    </Element>
  </>
);
