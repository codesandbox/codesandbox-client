import * as React from 'react';
import { ThemeContext } from '../contexts/theme-context';

export interface SandpackLayoutProps {
  style?: React.CSSProperties;
}

export const SandpackLayout: React.FC<SandpackLayoutProps> = ({
  children,
  style,
}) => {
  const { id } = React.useContext(ThemeContext);

  return (
    <div className={`sp-wrapper ${id}`} style={style}>
      {children}
    </div>
  );
};
