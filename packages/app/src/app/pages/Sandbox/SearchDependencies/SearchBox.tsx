import React, { useState, useEffect } from 'react';
import { Input, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import { AlgoliaIcon } from './icons';

export const SearchBox = ({ handleManualSelect, onChange }) => {
  const { state, actions } = useOvermind();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    onChange(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <form onSubmit={() => handleManualSelect(searchValue)}>
      <Element
        paddingLeft={4}
        css={css({
          position: 'relative',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'sideBar.border',

          '&:active:before': {
            background: 'red',
          },
          '&:before': {
            left: 4,
            width: 32,
            height: '100%',
            content: '""',
            position: 'absolute',
            top: 0,
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M7.75208 8.73995C6.9345 9.40212 5.89308 9.79879 4.75902 9.79879C2.13068 9.79879 0 7.66811 0 5.03978C0 2.41145 2.13068 0.280762 4.75902 0.280762C7.38735 0.280762 9.51803 2.41145 9.51803 5.03978C9.51803 6.17384 9.12136 7.21526 8.45919 8.03285L13.3536 12.9272L12.6464 13.6343L7.75208 8.73995ZM8.51803 5.03978C8.51803 7.11583 6.83506 8.79879 4.75902 8.79879C2.68297 8.79879 1 7.11583 1 5.03978C1 2.96373 2.68297 1.28076 4.75902 1.28076C6.83506 1.28076 8.51803 2.96373 8.51803 5.03978Z" fill="%23757575"/%3E%3C/svg%3E%0A')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          },
        })}
      >
        <Input
          autoFocus
          placeholder="Add npm dependency"
          css={css({
            paddingRight: 140,
            paddingLeft: 50,
            height: 65,
            fontSize: 4,
            color: 'white',
            backgroundColor: 'sideBar.background',
            border: 'none',
            ':focus, :hover': {
              border: 'none',
            },
          })}
          onChange={e => {
            setSearchValue(e.target.value);
            if (state.workspace.showingSelectedDependencies) {
              actions.workspace.toggleShowingSelectedDependencies();
            }
          }}
          value={searchValue}
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
