import * as React from 'react';
import { useClasser } from '@code-hike/classer';

export const SandpackStack: React.FC<{ customStyle?: React.CSSProperties }> = ({
  children,
  customStyle,
}) => {
  const c = useClasser('sp');

  return (
    <div className={c('stack')} style={customStyle}>
      {children}
    </div>
  );
};
