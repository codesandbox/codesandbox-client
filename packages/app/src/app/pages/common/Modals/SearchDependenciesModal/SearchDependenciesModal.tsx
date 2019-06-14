import React, { useRef } from 'react';
import { InstantSearch, Configure, PoweredBy } from 'react-instantsearch/dom';
import { connectAutoComplete } from 'react-instantsearch/connectors';
import Style from 'app/pages/Search/search';
import { useSignals } from 'app/store';
import DependenciesCSS from './globalStyles';
import { RawAutoComplete } from './RawAutoComplete';

const ConnectedAutoComplete = connectAutoComplete(RawAutoComplete);

export const SearchDependenciesModal = () => {
  const hitToVersionMap = useRef(new Map());
  const {
    editor: { addNpmDependency },
  } = useSignals();

  const onConfirm = (name, version, isDev = false) =>
    addNpmDependency({ name, version, isDev });

  const handleSelect = hit => {
    let version = hitToVersionMap.current.get(hit);

    if (!version && hit.tags) {
      version = hit.tags.latest;
    }

    onConfirm(hit.name, version, hit.isDev);
  };

  const handleManualSelect = (hitName, isDev) => {
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

    onConfirm(depName, version, isDev);
  };

  const handleHitVersionChange = (hit, version) => {
    hitToVersionMap.current.set(hit, version);
  };

  return (
    <div className="search-dependencies">
      <Style />
      <DependenciesCSS />
      <InstantSearch
        appId="OFCNCOG2CU"
        apiKey="00383ecd8441ead30b1b0ff981c426f5"
        indexName="npm-search"
      >
        <Configure
          analyticsTags={['codesandbox-dependencies']}
          hitsPerPage={5}
        />
        <ConnectedAutoComplete
          onSelect={handleSelect}
          onManualSelect={handleManualSelect}
          onHitVersionChange={handleHitVersionChange}
        />
        <footer>
          <PoweredBy />
        </footer>
      </InstantSearch>
    </div>
  );
};
