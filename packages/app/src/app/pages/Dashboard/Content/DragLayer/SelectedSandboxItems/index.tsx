import React, { useMemo } from 'react';
import { useOvermind } from 'app/overmind';

import AnimatedSandboxItem from './AnimatedSandboxItem';

interface ISelectedSandboxItemsProps {
  x: number;
  y: number;
  isOverPossibleTargets: boolean;
  id: string;
}

export const SelectedSandboxItems: React.FC<ISelectedSandboxItemsProps> = ({
  x,
  y,
  isOverPossibleTargets,
  id,
}) => {
  const {
    state: {
      dashboard: { selectedSandboxes },
    },
  } = useOvermind();

  const selectedIds = useMemo(
    () => [id, ...selectedSandboxes.filter(b => b !== id)],
    [id, selectedSandboxes]
  );

  const scale = isOverPossibleTargets ? 0.4 : 0.8;

  return (
    <>
      {selectedIds.map((sid, i) => (
        <AnimatedSandboxItem
          key={sid}
          id={sid}
          i={i}
          isLast={i === selectedIds.length - 1}
          x={x}
          y={y}
          scale={scale}
          selectedSandboxes={selectedIds}
        />
      ))}
    </>
  );
};
