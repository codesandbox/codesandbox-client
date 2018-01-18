import ui from './ui';

export default {
  title: 'sandbox.config.json',
  type: 'sandbox',
  description: 'Configuration specific to the current sandbox.',
  // moreInfoUrl: 'https://prettier.io/docs/en/configuration.html',
  ui,
  generateFile: () =>
    JSON.stringify(
      {
        infiniteLoopProtection: true,
        hardReloadOnChange: false,
      },
      null,
      2
    ),
};
