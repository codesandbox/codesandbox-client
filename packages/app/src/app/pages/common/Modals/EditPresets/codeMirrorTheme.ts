import { Element } from '@codesandbox/components';
import styled, { css } from 'styled-components';

export const CodemirrorWrapper = styled(Element)`
  ${({ theme }) => {
    const { vscodeTheme, colors } = theme;

    const getTokenColor = (name: string) => {
      const obj = vscodeTheme.tokenColors.find(
        token => token.name.toLowerCase() === name.toLowerCase()
      );
      if (obj) {
        return obj.settings.foreground;
      }

      return null;
    };

    return css`
      .CodeMirror {
        font-family: 'dm', monospace;
        font-weight: normal;
        font-size: 15px;
        line-height: 23px;
        letter-spacing: 0px;
        background: ${colors.editor.background};
        color: ${colors.sideBar.foreground};
      }
      .CodeMirror-lines {
        padding: 8px 0;
      }
      .CodeMirror-gutters {
        background-color: ${colors.sideBar.foreground};
        padding-right: 10px;
        z-index: 3;
        border: none;
      }
      div.CodeMirror-cursor {
        border-left: 2px solid ${colors.sideBar.foreground};
      }
      .CodeMirror-activeline-background {
        background: ${colors.editor.background};
      }
      .CodeMirror-selected {
        background: ${colors.sideBar.border};
      }
      .cm-keyword {
        color: ${getTokenColor('keyword')};
      }
      .cm-string,
      .cm-atom {
        color: ${getTokenColor('string')};
      }
      .cm-comment {
        font-style: italic;
        color: ${getTokenColor('comment')};
      }
      .cm-property {
        color: ${getTokenColor('[VSCODE-CUSTOM] JSON Property Name')};
      }
      .cm-number {
        color: ${getTokenColor('Keyword Other Unit')};
      }
      .cm-operator {
        color: ${getTokenColor(
          '[VSCODE-CUSTOM] JS/TS Meta Tag Keyword Operator'
        )};
      }
      .CodeMirror-linenumber,
      .CodeMirror .CodeMirror-gutters {
        background: ${colors.editor.background};
      }
    `;
  }}
`;
