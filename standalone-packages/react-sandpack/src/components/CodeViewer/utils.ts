import { PrismTheme, Language } from 'prism-react-renderer';
import { getSyntaxStyle } from '../../themes';
import { SandpackTheme } from '../../types';

export const getPrismTheme = (theme: SandpackTheme): PrismTheme => ({
  plain: getSyntaxStyle(theme.syntax.plain),
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: getSyntaxStyle(theme.syntax.comment),
    },
    {
      types: ['string', 'attr-value'],
      style: getSyntaxStyle(theme.syntax.static),
    },
    {
      types: ['punctuation', 'operator', 'deleted'],
      style: getSyntaxStyle(theme.syntax.plain),
    },
    {
      types: ['keyword'],
      style: getSyntaxStyle(theme.syntax.keyword),
    },
    {
      types: ['string'],
      style: getSyntaxStyle(theme.syntax.string ?? theme.syntax.static),
    },
    {
      types: ['function'],
      style: getSyntaxStyle(theme.syntax.definition),
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
      style: getSyntaxStyle(theme.syntax.static),
    },
    {
      types: ['atrule', 'attr-name', 'selector'],
      style: getSyntaxStyle(theme.syntax.property),
    },
    {
      types: ['tag'],
      style: getSyntaxStyle(theme.syntax.tag),
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
