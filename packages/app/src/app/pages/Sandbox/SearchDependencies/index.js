import React, { useRef, useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { SearchBox } from './SearchBox';
import { Dependency } from './Dependency';
import { AddDependencyModalFooter } from './Footer';

const client = algoliasearch('OFCNCOG2CU', '00383ecd8441ead30b1b0ff981c426f5');

const SearchDependencies = ({ onConfirm }) => {
  const hitToVersionMap = new Map();
  const index = useRef(client.initIndex('npm-search'));
  const [dependencies, setDependencies] = useState([]);
  const [selectedDeps, setSelectedDeps] = useState({});

  const handleSelect = hit => {
    let version = hitToVersionMap.get(hit);

    if (!version && hit.tags) {
      version = hit.tags.latest;
    }

    onConfirm(hit.name, version);
  };

  const handleManualSelect = hitName => {
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

  // const handleHitVersionChange = (hit, version) => {
  //   hitToVersionMap.set(hit, version);
  // };

  const getDependencies = async value => {
    const all = await index.current.search(value, {
      hitsPerPage: 50,
    });

    setDependencies(all.hits);
  };

  const onSelectDependencies = () => {
    Object.keys(selectedDeps).map(handleManualSelect);
  };

  const onDebouncedChange = value => getDependencies(value);

  useEffect(() => {
    getDependencies();
  }, []);

  return (
    <div
      className="search-dependencies"
      css={css({
        backgroundColor: 'sideBar.background',
        maxHeight: '70vh',
        position: 'relative',
      })}
    >
      <SearchBox
        onDebouncedChange={onDebouncedChange}
        handleManualSelect={handleManualSelect}
      />
      <Element
        css={css({
          maxHeight: '60vh',
          overflow: 'auto',
        })}
      >
        {dependencies.map(dependency => (
          <Dependency
            selectedDeps={selectedDeps}
            setSelectedDeps={setSelectedDeps}
            dependency={dependency}
            handleSelect={handleSelect}
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
