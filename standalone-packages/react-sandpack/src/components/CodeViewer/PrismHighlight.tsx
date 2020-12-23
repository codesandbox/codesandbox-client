import React, { useEffect } from 'react';
import Prism from 'prismjs';
import './prism.css';

export interface PrismHighlightProps {
  style?: React.CSSProperties;
  lang?: 'javascript' | 'html';
  children: string;
}

export const PrismHighlight = ({
  style,
  lang = 'javascript',
  children,
}: PrismHighlightProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre style={style}>
      <code className={`language-${lang}`}>{children}</code>
    </pre>
  );
};
