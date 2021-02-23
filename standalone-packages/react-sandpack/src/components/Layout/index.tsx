import * as React from 'react';
import { SandpackPartialTheme, SandpackPredefinedTheme } from '../../types';
import { SandpackThemeProvider } from '../../contexts/theme-context';
import { useSandpack } from '../../hooks/useSandpack';

export interface SandpackLayoutProps {
  style?: React.CSSProperties;
  theme?: SandpackPredefinedTheme | SandpackPartialTheme;
}

export const SandpackLayout: React.FC<SandpackLayoutProps> = ({
  children,
  style,
  theme,
}) => {
  const { sandpack } = useSandpack();

  return (
    <SandpackThemeProvider theme={theme}>
      <div className="sp-layout" style={style} ref={sandpack.lazyAnchorRef}>
        {children}
      </div>
    </SandpackThemeProvider>
  );
};
