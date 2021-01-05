import React, { useEffect } from 'react';
import Prism from 'prismjs';
// import './prism.css';
import { styled } from '../../stitches.config';

export interface PrismHighlightProps {
  lang?: 'javascript' | 'html';
  style?: Object;
  children: string;
}

const StyledBlock = styled('div', {
  fontSize: '$2',
  backgroundColor: '$neutral900',
});

export const PrismHighlight = ({
  lang = 'javascript',
  style,
  children,
}: PrismHighlightProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <StyledBlock style={style}>
      <pre>
        <code className={`language-${lang}`}>{children}</code>
      </pre>
    </StyledBlock>
  );
};
