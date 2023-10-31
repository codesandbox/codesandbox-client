import * as React from 'react';
import styled from 'styled-components';
import theme from '@codesandbox/common/lib/theme';

import { escapeHtml } from 'app/utils/escape';

import { TestError } from '../..';

const ansiHTML = require('ansi-html');

const Container = styled.div`
  font-family: Menlo, Source Code Pro, monospace;
  padding: 1rem;

  font-size: 0.875rem;
  line-height: 1.6;

  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  background-color: ${props => props.theme['sideBar.background']};
  white-space: pre-wrap;

  &:last-child {
    border-bottom: none;
  }
`;

const formatDiffMessage = (error: TestError, path: string) => {
  let finalMessage: string = '';
  if (error.matcherResult) {
    finalMessage = `<span>${escapeHtml(error.message)
      .replace(/(expected)/m, `<span style="color:${theme.green()}">$1</span>`)
      .replace(/(received)/m, `<span style="color:${theme.red()}">$1</span>`)
      .replace(/(Difference:)/m, `<span>$1</span>`)
      .replace(
        /(Expected.*\n)(.*)/m,
        `<span>$1</span><span style="color:${theme.green()}">$2</span>`
      )
      .replace(
        /(Received.*\n)(.*)/m,
        `<span>$1</span><span style="color:${theme.red()}">$2</span>`
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
          `<div ${code.highlight ? `style="font-weight:900;"` : ``}>` +
          (code.highlight
            ? `<span style="color:${theme.red()};">></span> `
            : '') +
          newMargin.join('') +
          escapeHtml('' + code.lineNumber) +
          ' | ' +
          escapeHtml(code.content) +
          '</div>';
      });
    finalMessage += '</div>';
  }

  return finalMessage.replace(/(?:\r\n|\r|\n)/g, '<br />');
};

export const ErrorDetails = ({
  error,
  path,
}: {
  error: TestError;
  path: string;
}) => (
  <Container
    dangerouslySetInnerHTML={{
      __html: formatDiffMessage(error, path),
    }}
  />
);
