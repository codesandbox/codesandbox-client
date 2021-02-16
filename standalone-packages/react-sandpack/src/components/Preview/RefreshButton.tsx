import * as React from 'react';
import { RefreshIcon } from '../../icons';
import { useSandpackNavigation } from '../../hooks/useSandpackNavigation';

export interface RefreshButtonProps {
  customStyle?: React.CSSProperties;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  customStyle,
}) => {
  const { refresh } = useSandpackNavigation();

  return (
    <button
      type="button"
      title="Refresh Sandpack"
      className="sp-button icon-standalone"
      style={customStyle}
      onClick={refresh}
    >
      <RefreshIcon />
    </button>
  );
};
