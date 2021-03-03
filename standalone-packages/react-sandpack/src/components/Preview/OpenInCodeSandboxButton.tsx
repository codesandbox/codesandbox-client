import * as React from 'react';
import { CSBIcon } from '../../icons';
import { useCodeSandboxLink } from '../../hooks/useCodeSandboxLink';
import { useSandpackTheme } from '../../hooks/useSandpackTheme';
import { useSandpack } from '../../hooks/useSandpack';
import { isDarkColor } from '../../utils/string-utils';

export interface OpenInCodeSandboxButtonProps {
  customStyle?: React.CSSProperties;
}

export const OpenInCodeSandboxButton: React.FC<OpenInCodeSandboxButtonProps> = ({
  customStyle,
}) => {
  const { sandpack } = useSandpack();
  const url = useCodeSandboxLink();
  const { theme } = useSandpackTheme();

  const csbIconClass = isDarkColor(theme.palette.defaultBackground)
    ? 'csb-icon-dark'
    : 'csb-icon-light';

  React.useEffect(() => {
    sandpack.openInCSBRegisteredRef.current = true;
  }, []);

  return (
    <a
      title="Open in CodeSandbox"
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className={`sp-button icon-standalone ${csbIconClass}`}
      style={customStyle}
    >
      <CSBIcon />
    </a>
  );
};
