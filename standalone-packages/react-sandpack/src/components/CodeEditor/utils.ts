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
      backgroundColor: theme.palette.mainBackground,
      '& ::selection': { backgroundColor: theme.palette.inactive },
    },

    '$$focused $selectionBackground': {
      backgroundColor: theme.palette.inactive,
    },

    $activeLine: { backgroundColor: hexToCSSRGBa(theme.palette.inactive, 0.5) },

    '$matchingBracket, $nonmatchingBracket': {
      color: 'inherit',
      background: theme.palette.inactive,
    },

    $gutters: {
      backgroundColor: theme.palette.mainBackground,
      color: theme.palette.defaultText,
      border: 'none',
    },
  });

export const getSyntaxHighlight = (theme: SandpackTheme) =>
  HighlightStyle.define(
    { tag: tags.link, textDecoration: 'underline' },
    {
      tag: tags.heading,
      textDecoration: 'underline',
      fontWeight: 'bold',
    },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strong, fontWeight: 'bold' },

    { tag: tags.keyword, color: theme.syntax.keyword },
    {
      tag: [tags.typeName, tags.namespace],
      color: theme.syntax.tag,
    },
    {
      tag: [
        tags.atom,
        tags.bool,
        tags.url,
        tags.contentSeparator,
        tags.labelName,
      ],
      color: theme.syntax.keyword,
    }, // boolean
    { tag: [tags.literal, tags.inserted], color: theme.syntax.static },
    {
      tag: [tags.regexp, tags.escape, tags.special(tags.string)],
      color: theme.syntax.property,
    }, // attributes (does not work yet)
    {
      tag: [tags.definition(tags.variableName), tags.local(tags.variableName)],
      color: theme.syntax.plain,
    },
    { tag: tags.definition(tags.propertyName), color: theme.syntax.property },
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
