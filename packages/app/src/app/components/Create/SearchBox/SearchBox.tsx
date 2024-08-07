import React from 'react';
import useKey from 'react-use/lib/useKey';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { SearchElement, InputWrapper } from './elements';

type SearchProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

// The event is bound to the Window by default that's the correct
// behavior since we should move the focus to the search box when
// the user presses the slash key. But the callback from useKey
// uses `KeyboardEvent` which doesn't have the expected target
// interface since it might originate from different elements.
// This is a workaround to check later if the event is triggered
// from an input and prevent moving the focus to the search box.
type KeyboardEventWithTarget = KeyboardEvent & {
  target: Window | HTMLInputElement;
};

export const SearchBox = ({
  value,
  onChange,
  placeholder = 'Search templates',
}: SearchProps) => {
  const inputEl = React.useRef<HTMLInputElement>();

  useKey('/', _e => {
    const e = (_e as unknown) as KeyboardEventWithTarget;

    // Do not trigger if the key event originates from
    // an input. This allows users to type / in the GH
    // url input.
    if (
      inputEl.current &&
      (!('type' in e.target) || e.target.type !== 'text')
    ) {
      requestAnimationFrame(() => {
        inputEl.current.focus();
      });
    }
  });

  const handleEsc = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.keyCode === ESC && inputEl.current) {
      evt.stopPropagation();
      inputEl.current.blur();
    }
  };

  return (
    <form
      noValidate
      action=""
      role="search"
      onSubmit={e => {
        e.preventDefault();
      }}
      style={{ width: '160px' }}
    >
      <InputWrapper>
        <SearchElement
          id="filter-templates"
          aria-label="search templates"
          autoComplete="false"
          placeholder={placeholder}
          ref={inputEl}
          value={value}
          onChange={onChange}
          onKeyDown={handleEsc}
          type="search"
        />
      </InputWrapper>
    </form>
  );
};
