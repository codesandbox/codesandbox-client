import * as React from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import { getPrismTheme } from './utils';

import { ThemeContext } from '../../utils/theme-context';

export interface PrismHighlightProps {
  lang?: Language;
  customStyle?: React.CSSProperties;
  code: string;
  showLineNumbers?: boolean;
}

export const PrismHighlight = ({
  lang = 'javascript',
  customStyle,
  code,
  showLineNumbers,
}: PrismHighlightProps) => {
  const theme = React.useContext(ThemeContext);

  return (
    <div
      style={{
        backgroundColor: 'var(--colors-backgroundMain)',
        padding: 'var(--space-4) var(--space-2)',
        lineHeight: '1.4',
        overflow: 'auto',
        flex: 1,
        ...customStyle,
      }}
    >
      <Highlight
        {...defaultProps}
        theme={getPrismTheme(theme)}
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
          <pre
            className={className}
            style={{ ...preStyle, margin: 0, fontFamily: 'var(--fonts-mono)' }}
          >
            {tokens.map((line, i) => (
              <div
                style={{ display: 'table-row' }}
                {...getLineProps({ line, key: i })}
              >
                {showLineNumbers && (
                  <span
                    style={{
                      display: 'table-cell',
                      textAlign: 'right',
                      paddingRight: 'var(--space-2)',
                      userSelect: 'none',
                      color: 'var(--colors-defaultText)',
                      minWidth: '28px',
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                <span
                  style={{
                    display: 'table-cell',
                    paddingLeft: 'var(--space-1)',
                  }}
                >
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};
