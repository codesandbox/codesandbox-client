import { PrismTheme, Language } from 'prism-react-renderer';
import { SandpackTheme } from '../../types';

export const getPrismTheme = (theme: SandpackTheme): PrismTheme => ({
  plain: {
    color: theme.syntax.plain,
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: theme.syntax.disabled,
        fontStyle: 'italic',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['string', 'attr-value'],
      style: {
        color: theme.syntax.static,
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: theme.syntax.plain,
      },
    },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'property',
        'regex',
        'inserted',
      ],
      style: {
        color: theme.syntax.keyword,
      },
    },
    {
      types: ['atrule', 'attr-name', 'selector'],
      style: {
        color: theme.syntax.property,
      },
    },
    {
      types: ['function', 'deleted'],
      style: {
        color: theme.syntax.plain,
      },
    },
    {
      types: ['tag'],
      style: {
        color: theme.syntax.tag,
      },
    },
    {
      types: ['keyword'],
      style: {
        color: theme.syntax.keyword,
      },
    },
  ],
});

export const getPrismLanguage = (filePath: string): Language => {
  const extensionDotIndex = filePath.lastIndexOf('.');
  const extension = filePath.slice(extensionDotIndex + 1);

  switch (extension) {
    case 'js':
      return 'jsx';
    case 'ts':
      return 'typescript';
    case 'vue':
    case 'html':
      return 'markup';
    default:
      return extension as Language;
  }
};
