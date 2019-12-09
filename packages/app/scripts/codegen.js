const isStaging = process.argv.includes('--staging');

const URL = `https://codesandbox.${isStaging ? `stream` : `io`}/api/graphql`;

module.exports = {
  schema: URL,
  documents: [`./src/**/*.gql`, `./src/**/queries.ts`, `./src/**/mutations.ts`],
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
    './src/app/graphql/introspection-result.ts': {
      plugins: [`fragment-matcher`],
    },
  },
};
