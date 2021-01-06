import React from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import { ReactDocsTheme } from './ReactDocsTheme';

import { styled } from '../../stitches.config';

export interface PrismHighlightProps {
  lang?: Language;
  style?: Object;
  code: string;
  showLineNumbers?: boolean;
}

const StyledBlock = styled('div', {
  fontSize: '$2',
  backgroundColor: '$neutral900',
  borderRight: '1px solid $neutral800',
  padding: '$4 $2',
  lineHeight: '1.4',

  pre: {
    margin: 0,
    fontFamily: '$mono',
  },
});

const Line = styled('div', {
  display: 'table-row',
});

const LineNo = styled('span', {
  display: 'table-cell',
  textAlign: 'right',
  paddingRight: '$2',
  userSelect: 'none',
  color: '$neutral500',
  minWidth: '28px',
});

const LineContent = styled('span', {
  display: 'table-cell',
  paddingLeft: '$1',
});

export const PrismHighlight = ({
  lang = 'javascript',
  style,
  code,
  showLineNumbers,
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
            <Line {...getLineProps({ line, key: i })}>
              {showLineNumbers && <LineNo>{i + 1}</LineNo>}
              <LineContent>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </LineContent>
            </Line>
          ))}
        </pre>
      )}
    </Highlight>
  </StyledBlock>
);
