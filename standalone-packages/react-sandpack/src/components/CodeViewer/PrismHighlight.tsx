import React from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import { ReactDocsTheme } from './ReactDocsTheme';

import { styled } from '../../stitches.config';

export interface PrismHighlightProps {
  lang?: Language;
  style?: Object;
  code: string;
}

const StyledBlock = styled('div', {
  fontSize: '$2',
  fontFamily: '$mono',
  backgroundColor: '$neutral900',
  padding: '$2',
  lineHeight: '1.4',

  pre: {
    margin: 0,
  },
});

export const PrismHighlight = ({
  lang = 'javascript',
  style,
  code,
}: PrismHighlightProps) => (
  <StyledBlock style={style}>
    <Highlight
      {...defaultProps}
      theme={ReactDocsTheme}
      code={code}
      language={lang}
    >
      {({
        className,
        style: preStyle,
        tokens,
        getLineProps,
        getTokenProps,
      }) => (
        <pre className={className} style={preStyle}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  </StyledBlock>
);
