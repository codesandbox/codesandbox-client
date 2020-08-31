import React from 'react';
import { Button, Stack, Tooltip } from '@codesandbox/components';
import css from '@styled-system/css';
import { CaseSensitiveIcon, RegexIcon } from '../icons';
import { OptionTypes } from '../index';

const OptionButton = ({ title, active, onClick, children }) => (
  <Tooltip label={title}>
    <Button
      variant="link"
      css={{
        paddingLeft: 0,
        paddingRight: 0,
        width: '16px',
        color: active ? 'white' : 'inherit',
        borderRadius: '50%',
        '.frame': {
          display: active ? 'block' : 'none',
        },
        '.overlay': {
          display: 'none',
        },
        ':hover:not(:disabled)': {
          backgroundColor: 'secondaryButton.background',
        },
        ':hover .inner': {
          color: 'black',
        },
        ':hover .overlay': {
          display: 'block',
        },
        ':focus:not(:disabled)': {
          outline: 'none',
          backgroundColor: 'secondaryButton.background',
        },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  </Tooltip>
);

const SearchOptions = ({ options, setOptions }) => {
  const toggleOptions = (key: OptionTypes) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [key]: !prevOptions[key],
    }));
  };

  return (
    <Stack
      css={css({
        position: 'absolute',
        right: 0,
        top: 0,
      })}
      gap={1}
    >
      <OptionButton
        onClick={() => toggleOptions(OptionTypes.CaseSensitive)}
        active={options[OptionTypes.CaseSensitive]}
        title="Case Sensitive"
      >
        <CaseSensitiveIcon />
      </OptionButton>
      <OptionButton
        onClick={() => toggleOptions(OptionTypes.Regex)}
        active={options[OptionTypes.Regex]}
        title="Allow Regex"
      >
        <RegexIcon />
      </OptionButton>
    </Stack>
  );
};

export default SearchOptions;
