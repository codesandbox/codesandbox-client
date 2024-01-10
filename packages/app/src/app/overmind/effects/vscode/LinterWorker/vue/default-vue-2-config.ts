import plugin from 'browser-eslint-rules/lib/eslint-plugin-vue';

const config = plugin.configs.essential;
export default {
  ...config.extends,
  ...config,
  rules: {
    ...config.extends.rules,
    ...config.rules,
  },
};
