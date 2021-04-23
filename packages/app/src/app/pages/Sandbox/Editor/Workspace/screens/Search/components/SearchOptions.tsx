import React from 'react';
import { Button, Stack, Tooltip } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { OptionTypes } from 'app/overmind/namespaces/workspace/state';
import { CaseSensitiveIcon, RegexIcon } from '../icons';

const OptionButton = ({ title, active, onClick, children }) => (
  <Tooltip label={title}>
    <Button
      variant="link"
      css={css({
        paddingLeft: 0,
        paddingRight: 0,
        width: '16px',
        color: active ? 'sideBar.foreground' : 'tab.inactiveForeground',
        borderRadius: '1px',
        '.frame': {
          display: active ? 'block' : 'none',
        },
        '.overlay': {
          display: 'none',
        },
        ':hover .inner': {
          color: 'black',
        },
        ':hover .overlay': {
          display: 'block',
        },
        ':focus:not(:disabled)': {
          outline: 'none',
        },
      })}
      onClick={onClick}
    >
      {children}
    </Button>
  </Tooltip>
);

export const SearchOptions = () => {
  const {
    workspace: { searchOptions },
  } = useAppState();
  const {
    workspace: { searchOptionsToggled },
  } = useActions();

  return (
    <Stack
      css={css({
        position: 'absolute',
        right: 2,
        top: 0,
      })}
      gap={1}
    >
      <OptionButton
        onClick={() => searchOptionsToggled(OptionTypes.CaseSensitive)}
        active={searchOptions[OptionTypes.CaseSensitive]}
        title="Case Sensitive"
      >
        <CaseSensitiveIcon />
      </OptionButton>
      <OptionButton
        onClick={() => searchOptionsToggled(OptionTypes.Regex)}
        active={searchOptions[OptionTypes.Regex]}
        title="Allow Regex"
      >
        <RegexIcon />
      </OptionButton>
    </Stack>
  );
};
