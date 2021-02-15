import { EditorView } from '@codemirror/view';
import { HighlightStyle, tags } from '@codemirror/highlight';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { SandpackTheme } from '../../types';
import { hexToCSSRGBa } from '../../utils/string-utils';

export const getEditorTheme = (theme: SandpackTheme) =>
  EditorView.theme({
    $: {
      color: theme.syntax.plain,
      backgroundColor: theme.palette.defaultBackground,
      '& ::selection': { backgroundColor: theme.palette.activeBackground },
    },

    '$$focused $selectionBackground': {
      backgroundColor: theme.palette.activeBackground,
    },

    $activeLine: {
      backgroundColor: hexToCSSRGBa(theme.palette.activeBackground, 0.5),
    },

    '$matchingBracket, $nonmatchingBracket': {
      color: 'inherit',
      background: theme.palette.activeBackground,
    },

    $gutters: {
      backgroundColor: theme.palette.defaultBackground,
      color: theme.palette.defaultText,
      border: 'none',
    },
  });

export const getSyntaxHighlight = (theme: SandpackTheme) =>
  HighlightStyle.define(
    { tag: tags.link, textDecoration: 'underline' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strong, fontWeight: 'bold' },

    {
      tag: [tags.keyword, tags.atom, tags.number, tags.bool],
      color: theme.syntax.keyword,
    },
    {
      tag: tags.typeName,
      color: theme.syntax.tag,
    },
    { tag: tags.variableName, color: theme.syntax.plain },
    // {
    //   tag: tags.definition(tags.variableName),
    //   color: theme.syntax.definition,
    // },
    { tag: [tags.literal, tags.inserted], color: theme.syntax.static },
    {
      tag: tags.propertyName,
      color: theme.syntax.property,
    },
    { tag: tags.punctuation, color: theme.syntax.punctuation },
    { tag: tags.comment, color: theme.syntax.disabled, fontStyle: 'italic' }
  );

export const getCodeMirrorLanguage = (filePath: string) => {
  const extensionDotIndex = filePath.lastIndexOf('.');
  const extension = filePath.slice(extensionDotIndex + 1);

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return javascript({ jsx: true });
    case 'vue':
    case 'html':
      return html();
    case 'css':
    case 'scss':
    case 'less':
      return css();
    default:
      return javascript();
  }
};
