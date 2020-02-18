import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import { AnimatedSandboxItem } from './AnimatedSandboxItem';

type Props = {
  id: string;
  isOverPossibleTargets: boolean;
  x: number;
  y: number;
};
export const SelectedSandboxItems: FunctionComponent<Props> = ({
  id,
  isOverPossibleTargets,
  x,
  y,
}) => {
  const {
    state: {
      dashboard: { selectedSandboxes },
    },
  } = useOvermind();
  const selectedIds = [id, ...selectedSandboxes.filter(b => b !== id)];

  return (
    <>
      {selectedIds.map((selectedId, index) => (
        <AnimatedSandboxItem
          id={selectedId}
          index={index}
          isLast={index === selectedIds.length - 1}
          key={selectedId}
          scale={isOverPossibleTargets ? 0.4 : 0.8}
          selectedSandboxes={selectedIds}
          x={x}
          y={y}
        />
      ))}
    </>
  );
};
