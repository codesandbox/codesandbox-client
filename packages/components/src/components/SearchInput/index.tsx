import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { uniqueId } from 'lodash-es';
import { Text } from '../Text';
import { InputComponent } from '../Input';
import { Element } from '../Element';

const SearchIconBase = props => (
  <svg fill="none" width="12" height="12" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.966 7.932a4.15 4.15 0 01-2.69.993C1.916 8.925 0 6.927 0 4.463 0 1.998 1.915 0 4.277 0s4.276 1.998 4.276 4.463c0 1.063-.356 2.04-.951 2.806L12 11.86l-.635.663-4.399-4.59zm.689-3.47c0 1.947-1.513 3.525-3.378 3.525C2.41 7.987.899 6.41.899 4.463.899 2.516 2.41.938 4.277.938c1.865 0 3.378 1.578 3.378 3.525z"
    />
  </svg>
);

export const SearchInputComponent = styled(InputComponent)(
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

export const SearchIcon = styled(SearchIconBase)(
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

interface ISearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const SearchInput: React.FC<ISearchProps> = ({ label, ...props }) => {
  const id = props.id || uniqueId('form_');

  return (
    <>
      {props.placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{props.placeholder}</label>
        </VisuallyHidden>
      ) : null}
      <Text
        as="label"
        size={2}
        marginBottom={2}
        htmlFor={id}
        style={{ display: 'block' }}
      >
        {label}
      </Text>
      <Element style={{ position: 'relative' }}>
        <SearchIcon />
        <SearchInputComponent id={id} {...props} type="search" />
      </Element>
    </>
  );
};
