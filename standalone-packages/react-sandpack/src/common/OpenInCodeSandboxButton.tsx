import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { CSBIcon } from '../icons';
import { useCodeSandboxLink } from '../hooks/useCodeSandboxLink';
import { useSandpackTheme } from '../hooks/useSandpackTheme';
import { isDarkColor } from '../utils/string-utils';

export const OpenInCodeSandboxButton: React.FC = () => {
  const url = useCodeSandboxLink();
  const { theme } = useSandpackTheme();
  const c = useClasser('sp');

  const csbIconClass = isDarkColor(theme.palette.defaultBackground)
    ? 'csb-icon-dark'
    : 'csb-icon-light';

  return (
    <a
      title="Open in CodeSandbox"
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className={c('button', 'icon-standalone', csbIconClass)}
    >
      <CSBIcon />
    </a>
  );
};
