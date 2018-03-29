import * as React from 'react';
import { InstantSearch, Configure, PoweredBy } from 'react-instantsearch/dom';
import { connectAutoComplete } from 'react-instantsearch/connectors';
import theme from 'common/theme';

import 'app/pages/Search/search.css';
import './dependencies.css';

import RawAutoComplete from './RawAutoComplete';

const ConnectedAutoComplete = connectAutoComplete(RawAutoComplete);

type Props = {
  onConfirm: (name: string, version: string) => void
}

export default class SearchDependencies extends React.PureComponent<Props> {
  hitToVersionMap = new Map();

  handleSelect = hit => {
    let version = this.hitToVersionMap.get(hit);

    if (!version && hit.tags) {
      version = hit.tags.latest;
    }

    this.props.onConfirm(hit.name, version);
  };

  handleManualSelect = hitName => {
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

    this.props.onConfirm(depName, version);
  };

  handleHitVersionChange = (hit, version) => {
    this.hitToVersionMap.set(hit, version);
  };

  render() {
    return (
      <InstantSearch
        appId="OFCNCOG2CU"
        apiKey="00383ecd8441ead30b1b0ff981c426f5"
        indexName="npm-search"
      >
        <Configure hitsPerPage={5} />
        <ConnectedAutoComplete
          onSelect={this.handleSelect}
          onManualSelect={this.handleManualSelect}
          onHitVersionChange={this.handleHitVersionChange}
        />
        <div
          style={{
            height: 40,
            backgroundColor: theme.background2.darken(0.2)(),
          }}
        >
          <PoweredBy />
        </div>
      </InstantSearch>
    );
  }
}
