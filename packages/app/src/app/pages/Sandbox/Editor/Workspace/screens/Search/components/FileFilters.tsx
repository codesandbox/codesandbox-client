import React from 'react';
import css from '@styled-system/css';
import { Element, Input } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

export const FileFilters = () => {
  const {
    state,
    actions: { workspace },
  } = useOvermind();

  return (
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
          value={state.workspace.searchOptions.filesToInclude}
          onChange={e => workspace.filesToIncludeChanged(e.target.value)}
        />
      </Element>

      <Element>
        <Input
          marginBottom={4}
          placeholder="Files to Exclude"
          value={state.workspace.searchOptions.filesToExclude}
          onChange={e => workspace.filesToExcludeChanged(e.target.value)}
        />
      </Element>
    </>
  );
};
