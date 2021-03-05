import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { SandpackPartialTheme, SandpackPredefinedTheme } from '../types';
import { SandpackThemeProvider } from '../contexts/theme-context';
import { useSandpack } from '../hooks/useSandpack';

export interface SandpackLayoutProps {
  theme?: SandpackPredefinedTheme | SandpackPartialTheme;
}

export const SandpackLayout: React.FC<SandpackLayoutProps> = ({
  children,
  theme,
}) => {
  const { sandpack } = useSandpack();
  const c = useClasser('sp');

  return (
    <SandpackThemeProvider theme={theme}>
      <div className={c('layout')} ref={sandpack.lazyAnchorRef}>
        {children}
      </div>
    </SandpackThemeProvider>
  );
};
