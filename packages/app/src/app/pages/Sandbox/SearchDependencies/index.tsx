import React, { useRef, useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { SearchBox } from './SearchBox';
import { Dependency } from './Dependency';
import { AddDependencyModalFooter } from './Footer';
import { dependencyType } from './types';

const client = algoliasearch('OFCNCOG2CU', '00383ecd8441ead30b1b0ff981c426f5');

const SearchDependencies = ({ onConfirm }) => {
  const hitToVersionMap = new Map();
  const index = useRef(client.initIndex('npm-search'));
  const [dependencies, setDependencies] = useState<dependencyType[] | []>([]);
  const [starterDeps, setStarterDeps] = useState<dependencyType[] | []>([]);
  const [selectedDeps, setSelectedDeps] = useState({});

  const handleSelect = (hit: dependencyType) => {
    let version = hitToVersionMap.get(hit);

    console.log(hitToVersionMap);

    if (!version && hit.tags) {
      version = hit.tags.latest;
    }

    onConfirm(hit.name, version);
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

  const handleHitVersionChange = (hit: dependencyType, version: string) => {
    hitToVersionMap.set(hit, version);
  };

  const getDependencies = async (value?: string) => {
    // @ts-ignore
    const all: {
      hits: dependencyType;
    } = await index.current.search(value, {
      // @ts-ignore
      hitsPerPage: 5,
    });

    if (all) {
      if (!value) {
        setStarterDeps(all.hits);
      }
      setDependencies(all.hits);
    }
  };

  const onSelectDependencies = () => {
    Object.values(selectedDeps)
      .filter(a => a)
      .map(handleSelect);
  };

  const onChange = (value?: string) => {
    if (value) {
      getDependencies(value);
    } else {
      setDependencies(starterDeps);
    }
  };

  const addToList = (dependency: dependencyType) =>
    setSelectedDeps(deps => ({
      ...deps,
      [dependency.objectID]: deps[dependency.objectID] ? null : dependency,
    }));

  useEffect(() => {
    getDependencies();
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
        css={css({
          height: '60vh',
          overflow: 'auto',
        })}
      >
        {dependencies.map(dependency => (
          <Dependency
            selectedDeps={selectedDeps}
            onVersionChange={handleHitVersionChange}
            dependency={dependency}
            handleSelect={() => addToList(dependency)}
          />
        ))}
      </Element>
      <AddDependencyModalFooter
        selectedDeps={selectedDeps}
        onClick={onSelectDependencies}
      />
    </div>
  );
};

export default SearchDependencies;
