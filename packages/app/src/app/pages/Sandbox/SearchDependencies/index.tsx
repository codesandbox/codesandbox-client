import React, { useEffect } from 'react';
import { json } from 'overmind';
import { Dependency as DependencyType } from '@codesandbox/common/lib/types/algolia';
import { useOvermind } from 'app/overmind';
import { Element, Text, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { SearchBox } from './SearchBox';
import { Dependency } from './Dependency';
import { AddDependencyModalFooter } from './Footer';

const SearchDependencies = ({ onConfirm }) => {
  const {
    state: { workspace },
    actions,
  } = useOvermind();

  const handleSelect = async (hit: DependencyType) => {
    let version = json(workspace.hitToVersionMap).get(hit.objectID);

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
    if (value) {
      actions.workspace.getDependencies(value);
    } else {
      actions.workspace.setDependencies(workspace.starterDependencies);
    }
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
        position: 'relative',
      })}
    >
      <SearchBox onChange={onChange} handleManualSelect={handleManualSelect} />
      <Element
        paddingBottom={10}
        css={css({
          height: '60vh',
          overflow: 'auto',
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

export default SearchDependencies;
