import { normalizePluginName, normalizePresetName } from './normalize-name';

describe('normalize babel plugin/preset names', () => {
  it('normalize plugin names', () => {
    expect(
      normalizePluginName('@babel/plugin-proposal-object-rest-spread')
    ).toBe('proposal-object-rest-spread');
    expect(normalizePluginName('@vue/babel-plugin-transform-vue-jsx')).toBe(
      '@vue/transform-vue-jsx'
    );
    expect(normalizePluginName('babel-plugin-transform-jsx')).toBe(
      'transform-jsx'
    );
    expect(
      normalizePluginName('babel-plugin-transform-jsx/some/sub/file')
    ).toBe('transform-jsx/some/sub/file');
  });

  it('normalize preset names', () => {
    expect(normalizePresetName('@babel/preset-env')).toBe('env');
    expect(normalizePresetName('@vue/babel-preset-app')).toBe('@vue/app');
    expect(normalizePresetName('babel-preset-jest')).toBe('jest');
    expect(normalizePresetName('babel-preset-jsx/some/sub/file')).toBe(
      'jsx/some/sub/file'
    );
  });
});
