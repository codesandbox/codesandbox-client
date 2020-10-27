const meow = require('meow')

function args(prettierConfig = {}) {
  return meow(
    `
    Usage: prettyhtml [<glob> ...] [options ...],

    Options:

    --tab-width       Specify the number of spaces per indentation-level
    --print-width     Specify the maximum line length
    --use-tabs        Use tabs for indentation
    --single-quote    Use single instead of double quotes
    --use-prettier    Use prettier to format embedded content
    --wrapAttributes  Force to wrap attributes (when it has multiple)
    --sortAttributes  Sort attributes alphabetically
    --stdin           Specify the standard stream as source (for pipe mode)
    --quiet           Do not output anything for a file which has no warnings or errors
    --silent          Do not output messages without fatal set to true

    Examples
      $ prettyhtml *.html
      $ prettyhtml *.html !example.html
      $ echo "<custom foo='bat'></custom>" | prettyhtml --stdin
      $ echo "<custom foo='bat'></custom>" --stdin ./test.html
    `,
    {
      autoHelp: true,
      autoVersion: true,
      flags: {
        tabWidth: {
          type: 'number',
          default: prettierConfig.tabWidth || 2
        },
        printWidth: {
          type: 'number',
          default: prettierConfig.printWidth || 80
        },
        useTabs: {
          type: 'boolean',
          default: prettierConfig.useTabs || false
        },
        singleQuote: {
          type: 'boolean',
          default: false
        },
        usePrettier: {
          type: 'boolean',
          default: true
        },
        wrapAttributes: {
          type: 'boolean',
          default: false
        },
        sortAttributes: {
          type: 'boolean',
          default: false
        },
        stdin: {
          type: 'boolean',
          default: false
        },
        quiet: {
          type: 'boolean',
          default: false
        },
        silent: {
          type: 'boolean',
          default: false
        }
      }
    }
  )
}

module.exports = args
