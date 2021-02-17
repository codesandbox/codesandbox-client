import { EditorView } from '@codemirror/view';
import { HighlightStyle, tags } from '@codemirror/highlight';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { SandpackTheme } from '../../types';
import { hexToCSSRGBa } from '../../utils/string-utils';
import { getSyntaxStyle } from '../../themes';

export const getEditorTheme = (theme: SandpackTheme) =>
  EditorView.theme({
    $: {
      backgroundColor: theme.palette.defaultBackground,
      '& ::selection': { backgroundColor: theme.palette.activeBackground },
      color: theme.palette.activeText,
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
      tag: tags.keyword,
      ...getSyntaxStyle(theme.syntax.keyword),
    },
    {
      tag: [tags.atom, tags.number, tags.bool],
      ...getSyntaxStyle(theme.syntax.static),
    },
    {
      tag: tags.typeName,
      ...getSyntaxStyle(theme.syntax.tag),
    },
    { tag: tags.variableName, ...getSyntaxStyle(theme.syntax.plain) },
    {
      tag: tags.definition(tags.function(tags.variableName)),
      ...getSyntaxStyle(theme.syntax.definition),
    },
    {
      tag: [tags.literal, tags.inserted],
      ...getSyntaxStyle(theme.syntax.string ?? theme.syntax.static),
    },
    {
      tag: tags.propertyName,
      ...getSyntaxStyle(theme.syntax.property),
    },
    { tag: tags.punctuation, ...getSyntaxStyle(theme.syntax.punctuation) },
    { tag: tags.comment, ...getSyntaxStyle(theme.syntax.comment) }
  );

export const getCodeMirrorLanguage = (filePath: string) => {
  const extensionDotIndex = filePath.lastIndexOf('.');
  const extension = filePath.slice(extensionDotIndex + 1);

  switch (extension) {
    case 'js':
    case 'jsx':
      return javascript({ jsx: true, typescript: false });
    case 'ts':
    case 'tsx':
      return javascript({ jsx: true, typescript: true });
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
