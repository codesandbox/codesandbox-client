/* @flow */
import isImage from 'common/utils/is-image';

const mdRegex = /\.md$/;
const yamlRegex = /\.yml$/;
const svgRegex = /\.svg$/;
const jsxRegex = /\.jsx$/;
const tsRegex = /\.tsx?$/;
const jsRegex = /\.js$/;
const reasonRegex = /\.re$/;
const sassRegex = /\.scss$/;

export function getMode(title: string = '') {
  const removeIgnoreTitle = title.split('ignore')[0].toLowerCase();

  // EXCEPTIONS

  if (removeIgnoreTitle === 'favicon.ico') return 'favicon';
  if (removeIgnoreTitle === 'yarn.lock') return 'yarn';
  if (removeIgnoreTitle === '.travis.yml') return 'travis';
  if (removeIgnoreTitle === 'package.json') return 'npm';
  if (removeIgnoreTitle === 'sandbox.config.json') return 'codesandbox';
  if (removeIgnoreTitle === 'readme.md') return 'readme';
  if (removeIgnoreTitle === 'contributing.md') return 'contributing';

  // TEST BASED
  if (mdRegex.test(removeIgnoreTitle)) return 'markdown';
  if (yamlRegex.test(removeIgnoreTitle)) return 'yaml';
  if (jsxRegex.test(removeIgnoreTitle)) return 'react';
  if (reasonRegex.test(removeIgnoreTitle)) return 'reason';
  if (sassRegex.test(removeIgnoreTitle)) return 'sass';
  if (!removeIgnoreTitle.includes('.')) return 'raw';
  if (removeIgnoreTitle.startsWith('.git')) return 'git';
  if (removeIgnoreTitle.startsWith('.flow')) return 'flow';
  if (
    removeIgnoreTitle.endsWith('.module.ts') ||
    removeIgnoreTitle.endsWith('.component.ts')
  )
    return 'angular';
  if (removeIgnoreTitle.includes('webpack')) return 'webpack';
  if (jsRegex.test(removeIgnoreTitle)) return 'javascript';
  if (
    tsRegex.test(title) ||
    title === 'tsconfig.json' ||
    title === 'tslint.json'
  ) {
    return 'typescript';
  }

  if (isImage(removeIgnoreTitle) && !svgRegex.test(removeIgnoreTitle)) {
    return 'image';
  }

  const titleArr = removeIgnoreTitle.split('.');

  if (removeIgnoreTitle.endsWith('rc')) {
    return titleArr.join('').split('rc')[0];
  }

  return titleArr[titleArr.length - 1];
}

export default function getType(title: string) {
  return getMode(title);
}
