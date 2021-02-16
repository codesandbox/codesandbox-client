import * as React from 'react';
import { FullScreenIcon } from '../../icons';
import { useCodeSandboxLink } from '../../hooks/useCodeSandboxLink';

export interface OpenInCodeSandboxButtonProps {
  customStyle?: React.CSSProperties;
}

export const OpenInCodeSandboxButton: React.FC<OpenInCodeSandboxButtonProps> = ({
  customStyle,
}) => {
  const url = useCodeSandboxLink();

  return (
    <a
      title="Open in CodeSandbox"
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="sp-button icon-standalone"
      style={customStyle}
    >
      <FullScreenIcon />
    </a>
  );
};
