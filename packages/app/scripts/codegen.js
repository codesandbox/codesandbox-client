const { execSync } = require('child_process');

const isStaging = process.argv.includes('--staging');

const URL = `https://codesandbox.${isStaging ? `stream` : `io`}/api/graphql`;

const token = execSync(`codesandbox token`, {
  env: {
    ...process.env,
    CODESANDBOX_NODE_ENV: isStaging ? 'development' : 'production',
  },
  cwd: process.cwd(),
  shell: true,
})
  .toString()
  .trim();

module.exports = {
  schema: {
    [URL]: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  },
  documents: `./src/**/*.gql`,
  overwrite: true,
  // hooks: {
  //   afterAllFileWrite: [`prettier --write`],
  // },
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
