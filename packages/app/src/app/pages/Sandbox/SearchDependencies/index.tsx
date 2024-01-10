import React, { useEffect, useRef } from 'react';
import { Dependency as DependencyType } from '@codesandbox/common/lib/types/algolia';
import { useAppState, useActions } from 'app/overmind';
import { Element, Text, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { isPrivateScope } from 'app/utils/private-registry';
import { SearchBox } from './SearchBox';
import { Dependency } from './Dependency';
import { AddDependencyModalFooter } from './Footer';

type DependencyListProps = {
  isPrivateDependency: boolean;
  list: React.MutableRefObject<HTMLDivElement>;
};

const DependencyList = ({ isPrivateDependency, list }: DependencyListProps) => {
  const { workspace } = useAppState();

  let message: string | undefined;

  if (!workspace.dependencies.length && !workspace.loadingDependencySearch) {
    message = 'It looks like there aren’t any matches for your query';
  } else if (isPrivateDependency) {
    message =
      "This is a private package, please fill in the full package name and press 'Enter'";
  }

  const dependencyList = workspace.showingSelectedDependencies
    ? Object.values(workspace.selectedDependencies).map(dependency => (
        <Dependency key={dependency.objectID} dependency={dependency} />
      ))
    : workspace.dependencies.map(dependency => (
        <Dependency key={dependency.objectID} dependency={dependency} />
      ));

  return (
    <Element
      ref={list}
      paddingBottom={10}
      css={css({
        height: '60vh',
        overflow: 'auto',
      })}
    >
      {message ? (
        <Stack align="center" justify="center" css={css({ height: '100%' })}>
          <Text variant="muted">{message}</Text>
        </Stack>
      ) : (
        dependencyList
      )}
    </Element>
  );
};

export const SearchDependencies = ({ onConfirm }) => {
  const actions = useActions();
  const { workspace, editor } = useAppState();
  const list = useRef();

  const [isPrivateDependency, setIsPrivateDependency] = React.useState<boolean>(
    false
  );

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

    setIsPrivateDependency(
      editor.currentSandbox &&
        isPrivateScope(editor.currentSandbox, searchValue)
    );
  };

  useEffect(() => {
    actions.workspace.clearSelectedDependencies();
    // Why did we call this? The action just returns when undefined
    // actions.workspace.getDependencies();

    return () => {
      actions.workspace.changeDependencySearch('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="search-dependencies"
      css={css({
        backgroundColor: 'sideBar.background',
        height: '70vh',
        position: 'relative',
      })}
    >
      <SearchBox
        onChange={onChange}
        handleManualSelect={handleManualSelect}
        listRef={list}
      />
      <DependencyList isPrivateDependency={isPrivateDependency} list={list} />
      <AddDependencyModalFooter onClick={onSelectDependencies} />
    </div>
  );
};
