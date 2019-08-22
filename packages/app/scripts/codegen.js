const URL = `https://codesandbox.${
  process.argv.includes('--staging') ? `stream` : `io`
}/api/graphql`;

module.exports = {
  schema: URL,
  documents: `./src/**/*.gql`,
  overwrite: true,
  hooks: {
    afterAllFileWrite: [`prettier --write`],
  },
  generates: {
    './src/types.d.ts': {
      plugins: [`typescript`, `typescript-graphql-files-modules`],
    },
    './src/app/graphql/introspection-result.ts': {
      plugins: [`fragment-matcher`],
    },
  },
};
