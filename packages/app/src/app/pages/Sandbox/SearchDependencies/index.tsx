import React, { useEffect, useRef } from 'react';
import { Dependency as DependencyType } from '@codesandbox/common/lib/types/algolia';
import { useOvermind } from 'app/overmind';
import { Element, Text, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { SearchBox } from './SearchBox';
import { Dependency } from './Dependency';
import { AddDependencyModalFooter } from './Footer';

export const SearchDependencies = ({ onConfirm }) => {
  const {
    state: { workspace },
    actions
  } = useOvermind();
  const list = useRef();

  const handleSelect = async (hit: DependencyType) => {
    let version = workspace.hitToVersionMap[hit.objectID];

    if (!version && hit.tags) {
      version = hit.tags.latest;
    }

    await onConfirm(hit.name, version);
  };

  const handleManualSelect = (hitName: string) => {
    if (!hitName) {
      return;
    }

    const isScoped = hitName.startsWith('@');
    let version = 'latest';

    const splittedName = hitName.split('@');

    if (splittedName.length > (isScoped ? 2 : 1)) {
      version = splittedName.pop();
    }

    const depName = splittedName.join('@');

    onConfirm(depName, version);
  };

  const onSelectDependencies = () => {
    Object.values(workspace.selectedDependencies)
      .filter(a => a)
      .map(handleSelect);
  };

  const onChange = (value?: string) => {
    let searchValue = value;
    if (searchValue.includes('@') && !searchValue.startsWith('@')) {
      searchValue = value.split('@')[0];
    }

    if (searchValue.startsWith('@')) {
      // if it starts with one and has a version
      if (searchValue.split('@').length === 3) {
        const part = searchValue.split('@');
        searchValue = `@${part[0]}${part[1]}`;
      }
    }

    actions.workspace.getDependencies(searchValue);
  };

  useEffect(() => {
    actions.workspace.clearSelectedDependencies();
    actions.workspace.getDependencies();
  }, []);

  return (
    <div
      className="search-dependencies"
      css={css({
        backgroundColor: 'sideBar.background',
        height: '70vh',
        position: 'relative'
      })}
    >
      <SearchBox
        onChange={onChange}
        handleManualSelect={handleManualSelect}
        listRef={list}
      />
      <Element
        ref={list}
        paddingBottom={10}
        css={css({
          height: '60vh',
          overflow: 'auto'
        })}
      >
        {!workspace.dependencies.length &&
        !workspace.loadingDependencySearch ? (
          <Stack align="center" justify="center" css={css({ height: '100%' })}>
            <Text variant="muted">
              It looks like there aren’t any matches for your query
            </Text>
          </Stack>
        ) : null}
        {workspace.showingSelectedDependencies
          ? Object.values(workspace.selectedDependencies).map(dependency => (
              <Dependency key={dependency.objectID} dependency={dependency} />
            ))
          : workspace.dependencies.map(dependency => (
              <Dependency key={dependency.objectID} dependency={dependency} />
            ))}
      </Element>
      <AddDependencyModalFooter onClick={onSelectDependencies} />
    </div>
  );
};
