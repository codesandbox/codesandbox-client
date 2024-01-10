const isStaging = process.argv.includes('--staging');
const isDev = process.argv.includes('--dev');

const host = (() => {
  if (isDev) {
    return 'http://server:4000';
  }

  if (isStaging) {
    return 'https://codesandbox.stream';
  }

  return 'https://codesandbox.io';
})();

const URL = `${host}/api/graphql`;

module.exports = {
  schema: URL,
  documents: [
    `./src/**/*.gql`,
    `./src/app/overmind/effects/gql/**/*.ts`,
    `./src/**/queries.ts`,
    `./src/**/mutations.ts`,
    `./src/**/subscriptions.ts`,
  ],
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
