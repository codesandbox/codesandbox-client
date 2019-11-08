const isStaging = process.argv.includes('--staging');

const URL = `https://codesandbox.${isStaging ? `stream` : `io`}/api/graphql`;

module.exports = {
  schema: URL,
  documents: [`./src/**/*.gql`, `./src/**/queries.ts`],
  overwrite: true,
  hooks: {
    afterAllFileWrite: [`prettier --write`],
  },
  generates: {
    './src/app/graphql/types.ts': {
      plugins: [`typescript`, `typescript-operations`],
      config: {
        avoidOptionals: true,
      },
    },
    './src/app/graphql/globals.d.ts': {
      plugins: [`typescript-graphql-files-modules`],
    },
    './src/app/graphql/introspection-result.ts': {
      plugins: [`fragment-matcher`],
    },
  },
};
