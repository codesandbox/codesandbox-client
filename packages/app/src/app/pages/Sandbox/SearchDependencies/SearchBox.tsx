import React, { useState, useEffect, useRef } from 'react';
import { Input, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import useKeys from 'react-use/lib/useKeyboardJs';
import { AlgoliaIcon } from './icons';

const getBackgroundColor = ({ focus, theme }) =>
  `url('data:image/svg+xml,%3Csvg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M7.75208 8.73995C6.9345 9.40212 5.89308 9.79879 4.75902 9.79879C2.13068 9.79879 0 7.66811 0 5.03978C0 2.41145 2.13068 0.280762 4.75902 0.280762C7.38735 0.280762 9.51803 2.41145 9.51803 5.03978C9.51803 6.17384 9.12136 7.21526 8.45919 8.03285L13.3536 12.9272L12.6464 13.6343L7.75208 8.73995ZM8.51803 5.03978C8.51803 7.11583 6.83506 8.79879 4.75902 8.79879C2.68297 8.79879 1 7.11583 1 5.03978C1 2.96373 2.68297 1.28076 4.75902 1.28076C6.83506 1.28076 8.51803 2.96373 8.51803 5.03978Z" fill="%23${
    focus
      ? theme?.colors?.input?.foreground?.replace('#', '')
      : theme?.colors?.mutedForeground?.replace('#', '')
  }"/%3E%3C/svg%3E%0A')`;

export const SearchBox = ({ handleManualSelect, onChange, listRef }) => {
  const {
    state: { workspace },
    actions: {
      workspace: { changeDependencySearch, toggleShowingSelectedDependencies },
    },
  } = useOvermind();
  const [focus, setFocus] = useState(false);
  const form = useRef<HTMLFormElement>();
  const [up] = useKeys('up');
  const [down] = useKeys('down');

  useEffect(() => {
    const list = listRef.current as HTMLUListElement;
    const first = list.firstChild as HTMLButtonElement;
    const last = list.lastChild as HTMLButtonElement;
    const formRef: HTMLFormElement = form.current;
    const activeElement = document.activeElement as
      | HTMLButtonElement
      | HTMLInputElement;

    if (formRef) {
      const input = formRef.getElementsByTagName('input')[0];
      if (up) {
        if (
          activeElement === (input || first) ||
          !activeElement.previousSibling
        ) {
          if (activeElement === first) {
            input.focus();
          }
          // do nothing
        } else {
          const prev = activeElement.previousSibling as HTMLButtonElement;
          if (prev?.focus) {
            prev.focus();
          }
        }
      }
      if (down) {
        if (activeElement === last) {
          // do nothing
        } else if (activeElement === input && first) {
          first.focus();
        } else {
          const next = activeElement.nextSibling as HTMLButtonElement;
          if (next?.focus) {
            next.focus();
          }
        }
      }
    }
  }, [up, down]);

  useEffect(() => {
    onChange(workspace.dependencySearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.dependencySearch]);

  return (
    <form
      ref={form}
      onSubmit={() => handleManualSelect(workspace.dependencySearch)}
    >
      <Element
        paddingLeft={4}
        css={css({
          position: 'relative',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'sideBar.border',

          '&:before': {
            left: 4,
            width: 32,
            height: '100%',
            content: '""',
            position: 'absolute',
            top: 0,
            backgroundImage: (theme) => getBackgroundColor({ focus, theme }),
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            opacity: focus ? 1 : 0.8,
          },
        })}
      >
        <Input
          autoFocus
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="Add npm dependency"
          css={css({
            paddingRight: 140,
            paddingLeft: 10,
            height: 65,
            fontSize: 4,
            color: 'input.foreground',
            backgroundColor: 'sideBar.background',
            border: 'none',
            ':focus, :hover': {
              border: 'none',
            },
            '::-webkit-input-placeholder': {
              fontSize: 4,
            },
            '::-moz-placeholder': {
              fontSize: 4,
            },
            ':-ms-input-placeholder': {
              fontSize: 4,
            },
            ':-moz-placeholder': {
              fontSize: 4,
            },
          })}
          onChange={e => {
            changeDependencySearch(e.target.value);
            if (workspace.showingSelectedDependencies) {
              toggleShowingSelectedDependencies();
            }
          }}
          value={workspace.dependencySearch}
        />
        <AlgoliaIcon
          css={css({
            top: 4,
            right: 4,
            position: 'absolute',
          })}
        />
      </Element>
    </form>
  );
};
