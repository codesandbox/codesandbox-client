import React from 'react';
import { useKey } from 'react-use';
import { SearchElement, InputWrapper } from './elements';

type SearchProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const SearchBox = ({
  value,
  onChange,
  placeholder = 'Search',
}: SearchProps) => {
  const inputEl = React.useRef<HTMLInputElement>();

  useKey('/', () => {
    if (inputEl.current) {
      requestAnimationFrame(() => {
        inputEl.current.focus();
      });
    }
  });

  useKey('Escape', () => {
    if (inputEl.current) {
      const isFocused = document.activeElement === inputEl.current;

      if (isFocused) {
        inputEl.current.blur();
      }
    }
  });

  return (
    <form
      noValidate
      action=""
      role="search"
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <InputWrapper>
        <SearchElement
          placeholder={placeholder}
          ref={inputEl}
          value={value}
          onChange={onChange}
          type="search"
        />
      </InputWrapper>
    </form>
  );
};
