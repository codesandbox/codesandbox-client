import React from 'react';
import { inject, observer } from 'mobx-react';
import { memoize } from 'lodash-es';

import AnimatedSandboxItem from './AnimatedSandboxItem';

class SelectedSandboxItems extends React.Component {
  getSelectedIds = memoize((id, sandboxes) => [
    id,
    ...sandboxes.filter(x => x !== this.props.id),
  ]);

  render() {
    const { x, y, left, top, isOverPossibleTargets } = this.props;
    const selectedSandboxes = this.props.store.dashboard.selectedSandboxes;
    const selectedIds = this.getSelectedIds(this.props.id, selectedSandboxes);

    const scale = isOverPossibleTargets ? 0.4 : 0.8;

    return selectedIds.map((id, i) => (
      <AnimatedSandboxItem
        key={id}
        id={id}
        i={i}
        isLast={i === selectedIds.length - 1}
        x={x}
        y={y}
        left={left}
        top={top}
        scale={scale}
        selectedSandboxes={selectedIds}
      />
    ));
  }
}

export default inject('store', 'signals')(observer(SelectedSandboxItems));
