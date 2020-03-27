import React from 'react';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';

const CodeIcon = props => (
  <svg width={56} height={56} fill="none" viewBox="0 0 56 56" {...props}>
    <path
      fill="#999"
      fillRule="evenodd"
      d="M29.529 36l-1.386-.32L32.365 20l1.386.32L29.529 36zM21 27.936l4.976-5.291 1.244 1.323-3.732 3.968 3.732 3.968-1.244 1.323L21 27.937zm20 0l-4.976 5.291-1.243-1.322 3.731-3.969-3.731-3.968 1.243-1.323L41 27.936z"
      clipRule="evenodd"
    />
  </svg>
);

export const CodeButton = ({ onClick }) => (
  <Element
    css={css({
      cursor: 'pointer',
      position: 'absolute',
      bottom: 0,
      right: 0,
      border: 'none',
      backgroundColor: 'transparent',
      padding: 0,
    })}
    as="button"
  >
    <CodeIcon onClick={onClick} />
  </Element>
);
