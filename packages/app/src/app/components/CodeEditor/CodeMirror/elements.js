import styled, { css, keyframes } from 'styled-components';
import theme from '@codesandbox/common/lib/theme';

const fadeInAnimation = keyframes`
  0%   { background-color: #374140; }
  100% { background-color: #561011; }
`;

const fontFamilies = (...families) =>
  families
    .filter(Boolean)
    .map(family => (family.includes(' ') ? JSON.stringify(family) : family))
    .join(', ');

export const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const getTokenColor = (scope, defaultStyles) => ({ theme: givenTheme }) => {
  if (
    !givenTheme ||
    !givenTheme.vscodeTheme ||
    givenTheme.vscodeTheme.isCodeSandbox
  ) {
    return defaultStyles;
  }

  const foundScope = givenTheme.vscodeTheme.tokenColors.find(
    token => token && token.scope && token.scope.indexOf(scope) === 0
  );

  if (foundScope && foundScope.settings) {
    return css`
      ${foundScope.settings.foreground &&
        `color: ${foundScope.settings.foreground};`}
      ${foundScope.settings.background &&
        `background: ${foundScope.settings.background};`}
      ${foundScope.settings.fontStyle &&
        `font-style: ${foundScope.settings.fontStyle};`}
    `;
  }

  return '';
};

export const CodeContainer = styled.div`
  position: relative;
  overflow: auto;
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  .CodeMirror {
    font-family: ${props =>
      fontFamilies(props.fontFamily, 'Menlo', 'Source Code Pro', 'monospace')};
    line-height: ${props => props.lineHeight};
    background: ${props =>
      props.theme['editor.background'] || theme.background2()};
    color: ${props =>
      props.theme['editor.foreground'] || props.theme.foreground || '#e0e0e0'};
    height: 100%;
    font-weight: 500;

    /* For retina screens we will not do subpixel anti-aliasing. That looks uglier. */
    @media (-webkit-min-device-pixel-ratio: 1.5) {
      -webkit-font-smoothing: auto;
    }
  }
  div.CodeMirror-selected {
    background: ${props => props.theme['selection.background'] || '#65737e'};
  }
  .CodeMirror-line::selection,
  .CodeMirror-line > span::selection,
  .CodeMirror-line > span > span::selection {
    background: ${props => props.theme['selection.background'] || '#65737e'};
  }
  .CodeMirror-line::-moz-selection,
  .CodeMirror-line > span::-moz-selection,
  .CodeMirror-line > span > span::-moz-selection {
    background: ${props => props.theme['selection.background'] || '#65737e'};
  }
  .CodeMirror-gutters {
    background: ${props =>
      props.theme['editorGutter.background'] || theme.background2()};
    border-right: 0px;
  }
  .CodeMirror-guttermarker {
    color: #ac4142;
  }
  .CodeMirror-guttermarker-subtle {
    color: ${props => props.theme['editorLineNumber.foreground'] || '#505050'};
  }
  .CodeMirror-linenumber {
    color: ${props => props.theme['editorLineNumber.foreground'] || '#505050'};
  }
  .CodeMirror-cursor {
    border-left: 1px solid
      ${props => props.theme['editorCursor.foreground'] || '#b0b0b0'};
  }

  span.cm-comment {
    ${getTokenColor('comment', 'color: #626466')};
  }

  span.cm-atom {
    ${getTokenColor('constant.numeric', 'color: #aa759f')};
  }

  span.cm-number {
    ${getTokenColor('constant.numeric', 'color: #aa759f')};
  }

  span.cm-property {
    ${getTokenColor('variable.instance', 'color: #aa759f')};
  }

  span.cm-attribute {
    ${getTokenColor('entity.other.attribute-name', 'color: #aa759f')};
  }

  span.cm-keyword {
    ${getTokenColor('keyword', `color: ${theme.secondary()}`)};
  }
  span.cm-string {
    ${getTokenColor('string', 'color: #99c794')};
  }

  span.cm-variable {
    color: ${theme.primary.darken(0.1)()};
  }
  span.cm-variable-2 {
    color: ${theme.secondary()};
  }
  span.cm-def {
    ${getTokenColor('variable.other.object.property', 'color: #fac863;')};
  }
  span.cm-bracket {
    ${getTokenColor('meta.brace.round.js', 'color: #e0e0e0')};
  }
  span.cm-tag {
    ${getTokenColor('entity.name.tag', 'color: #ec5f67')};
  }
  span.cm-link {
    color: #aa759f;
  }
  span.cm-error {
    background: #ac4142;
    color: #b0b0b0;
  }

  .CodeMirror-matchingbracket {
    text-decoration: underline;
    color: white !important;
  }
  span.CodeMirror-matchingtag {
    background-color: inherit;
  }
  span.cm-tag.CodeMirror-matchingtag {
    text-decoration: underline;
  }
  span.cm-tag.cm-bracket.CodeMirror-matchingtag {
    text-decoration: none;
  }

  div.cm-line-error.CodeMirror-linebackground {
    animation: ${fadeInAnimation} 0.3s;
    background-color: #561011;
  }

  .CodeMirror-activeline-background {
    background: ${props =>
      props.theme['editor.lineHighlightBackground'] || 'rgba(0, 0, 0, 0.3)'};
  }

  div.cm-line-highlight.CodeMirror-linebackground {
    background: ${props =>
      props.theme['editor.lineHighlightBackground'] || 'rgba(0, 0, 0, 0.3)'};
  }
`;
