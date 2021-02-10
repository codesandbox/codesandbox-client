import React from 'react';
import css from '@styled-system/css';
import { Element, Input } from '@codesandbox/components';

export const FileFilters = ({
  setFilesToSearch,
  setFilesToExclude,
  showFileFilters,
}) =>
  showFileFilters ? (
    <>
      <Element
        css={css({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'sideBar.border',
          marginBottom: 4,
        })}
      />
      <Element>
        <Input
          marginBottom={4}
          placeholder="Files to Include"
          onChange={e => setFilesToSearch(e.target.value)}
        />
      </Element>

      <Element>
        <Input
          marginBottom={4}
          placeholder="Files to Exclude"
          onChange={e => setFilesToExclude(e.target.value)}
        />
      </Element>
    </>
  ) : null;
