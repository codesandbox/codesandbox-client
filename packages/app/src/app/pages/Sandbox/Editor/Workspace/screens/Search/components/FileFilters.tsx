import React, { useState } from 'react';
import { Element, Input, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { MoreIcon } from '../icons';

export const FileFilters = ({ setFilesToSearch, setFilesToExclude }) => {
  const [showExclude, setShowExclude] = useState(false);
  return (
    <>
      <Element
        css={css({
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 26px',
          gridGap: 2,
        })}
      >
        <Input
          marginBottom={4}
          css={css({
            paddingRight: '50px',
          })}
          placeholder="Files to Include"
          onChange={e => setFilesToSearch(e.target.value)}
        />
        <Button
          variant="secondary"
          autoWidth
          onClick={() => setShowExclude(exclude => !exclude)}
          css={{
            color: showExclude ? 'sideBar.foreground' : 'inherit',
            backgroundColor: showExclude
              ? 'secondaryButton.background'
              : 'transparent',

            ':hover:not(:disabled)': {
              color: 'sideBar.foreground',
              backgroundColor: 'secondaryButton.background',
            },

            ':focus:not(:disabled)': {
              outline: 'none',
              backgroundColor: 'secondaryButton.background',
            },
          }}
        >
          <MoreIcon />
        </Button>
      </Element>
      {showExclude ? (
        <Element>
          <Input
            marginBottom={4}
            css={css({
              paddingRight: '50px',
            })}
            placeholder="Files to Exclude"
            onChange={e => setFilesToExclude(e.target.value)}
          />
        </Element>
      ) : null}
    </>
  );
};
