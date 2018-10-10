import React from 'react';
import styled from 'styled-components';
import theme from 'common/theme';
import ansiHTML from 'ansi-html';

import type { TestError } from '../../';

const Container = styled.div`
  font-family: Menlo, Source Code Pro, monospace;
  padding: 1rem;

  font-size: 0.875rem;
  line-height: 1.6;

  color: rgba(255, 255, 255, 0.8);

  background-color: rgba(0, 0, 0, 0.5);

  white-space: pre-wrap;

  border-bottom: 1px solid rgba(0, 0, 0, 0.5);

  &:last-child {
    border-bottom: none;
  }
`;

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const white = 'rgba(255, 255, 255, 0.8)';

const formatDiffMessage = (error: TestError, path: string) => {
  let finalMessage: string = '';
  if (error.matcherResult) {
    finalMessage = `<span style="color:rgba(255, 255, 255, 0.5);">${escapeHtml(
      error.message
    )
      .replace(/(expected)/m, `<span style="color:${theme.green()}">$1</span>`)
      .replace(/(received)/m, `<span style="color:${theme.red()}">$1</span>`)
      .replace(/(Difference:)/m, `<span style="color:${white}">$1</span>`)
      .replace(
        /(Expected.*\n)(.*)/m,
        `<span style="color:${white}">$1</span><span style="color:${theme.green()}">$2</span>`
      )
      .replace(
        /(Received.*\n)(.*)/m,
        `<span style="color:${white}">$1</span><span style="color:${theme.red()}">$2</span>`
      )
      .replace(/^(-.*)/gm, `<span style="color:${theme.red()}">$1</span>`)
      .replace(
        /^(\+.*)/gm,
        `<span style="color:${theme.green()}">$1</span>`
      )}</span>`;
  } else {
    finalMessage = escapeHtml(error.message + '\n\n' + error.stack);
  }

  finalMessage = ansiHTML(finalMessage);

  if (
    error.mappedErrors &&
    error.mappedErrors[0] &&
    error.mappedErrors[0].fileName.endsWith(path) &&
    error.mappedErrors[0]._originalScriptCode
  ) {
    const mappedError = error.mappedErrors[0];

    const widestNumber =
      Math.max(
        ...mappedError._originalScriptCode.map(
          code => (code.lineNumber + '').length
        )
      ) + 2;
    const margin = Array.from({ length: widestNumber }).map(() => ' ');

    finalMessage += '<br />';
    finalMessage += '<br />';
    finalMessage += '<div>';
    mappedError._originalScriptCode
      .filter(x => x.content.trim())
      .forEach(code => {
        const currentLineMargin = (code.lineNumber + '').length;
        const newMargin = [...margin];
        newMargin.length -= currentLineMargin;
        if (code.highlight) {
          newMargin.length -= 2;
        }

        finalMessage +=
          `<div ${
            code.highlight
              ? `style="font-weight:900;color:rgba(255, 255, 255, 0.5)"`
              : ``
          }>` +
          (code.highlight
            ? `<span style="color:${theme.red()};">></span> `
            : '') +
          newMargin.join('') +
          code.lineNumber +
          ' | ' +
          escapeHtml(code.content) +
          '</div>';
      });
    finalMessage += '</div>';
  }

  return finalMessage.replace(/(?:\r\n|\r|\n)/g, '<br />');
};

export default ({ error, path }: { error: TestError, path: string }) => (
  <Container
    dangerouslySetInnerHTML={{
      __html: formatDiffMessage(error, path),
    }}
  />
);
