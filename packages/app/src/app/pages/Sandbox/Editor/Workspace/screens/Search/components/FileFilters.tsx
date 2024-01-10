import React from 'react';
import css from '@styled-system/css';
import { Element, Input } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';

export const FileFilters = () => {
  const state = useAppState();
  const { workspace } = useActions();

  return (
    <>
      <Element
        css={css({
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'sideBar.border',
          marginBottom: 4,
        })}
      />

      <Element paddingX={2} marginBottom={4}>
        <Input
          placeholder="Files to Include"
          value={state.workspace.searchOptions.filesToInclude}
          onChange={e => workspace.filesToIncludeChanged(e.target.value)}
        />
      </Element>

      <Element paddingX={2} marginBottom={4}>
        <Input
          placeholder="Files to Exclude"
          value={state.workspace.searchOptions.filesToExclude}
          onChange={e => workspace.filesToExcludeChanged(e.target.value)}
        />
      </Element>
    </>
  );
};
