const {
  series: { nps: series },
  concurrent: { nps: parallel },
} = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps help',

    build: {
      default: 'webpack',
      build: {
        prod: {
          description: 'Build script for production',
          script:
            'cross-env NODE_OPTIONS="--max-old-space-size=4096" lerna run build  --scope homepage --stream && lerna run build --scope app --stream && lerna run copy-assets --scope app --stream',
        },
        embed: {
          description: 'Build embeds',
          script: 'lerna run build:embed --scope app --stream && gulp',
        },
        common: {
          description: 'Build common modules',
          script: 'lerna run build:dev --scope @codesandbox/common --stream',
        },
        dynamic: {
          description: 'Build dynamic pages',
          script: 'lerna run build --scope dynamic-pages --stream',
        },
        deps: {
          description: 'Build dependencies for app (across multiple packages)',
          script: 'lerna run build:dev',
        },
        clean: {
          script:
            'lerna run build:clean --scope app --scope homepage && rimraf www',
        },
      },
    },
  },
};
