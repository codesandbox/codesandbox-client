import { PrismTheme } from 'prism-react-renderer';
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
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: {
        color: theme.syntax.property,
      },
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: {
        color: theme.syntax.plain,
      },
    },

    {
      types: ['tag', 'selector', 'keyword'],
      style: {
        color: theme.syntax.keyword,
      },
    },
  ],
});
