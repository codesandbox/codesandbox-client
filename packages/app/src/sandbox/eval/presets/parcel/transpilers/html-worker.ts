// eslint-disable-next-line spaced-comment
/// <reference lib="webworker" />
/* eslint-disable no-continue */
/* eslint-disable no-inner-declarations */
import parse from 'posthtml-parser';
import api from 'posthtml/lib/api';

import isUrl from './is-url';
import { ChildHandler } from '../../../transpilers/worker-transpiler/child-handler';

const childHandler = new ChildHandler('html-worker');

// A list of all attributes that may produce a dependency
// Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
const ATTRS = {
  src: [
    'script',
    'img',
    'audio',
    'video',
    'source',
    'track',
    'iframe',
    'embed',
  ],
  href: ['link', 'a'],
  poster: ['video'],
  'xlink:href': ['use'],
  content: ['meta'],
};

// A list of metadata that should produce a dependency
// Based on:
// - http://schema.org/
// - http://ogp.me
// - https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup
// - https://msdn.microsoft.com/en-us/library/dn255024.aspx
const META = {
  property: [
    'og:image',
    'og:image:url',
    'og:image:secure_url',
    'og:audio',
    'og:audio:secure_url',
    'og:video',
    'og:video:secure_url',
  ],
  name: [
    'twitter:image',
    'msapplication-square150x150logo',
    'msapplication-square310x310logo',
    'msapplication-square70x70logo',
    'msapplication-wide310x150logo',
    'msapplication-TileImage',
  ],
  itemprop: [
    'image',
    'logo',
    'screenshot',
    'thumbnailUrl',
    'contentUrl',
    'downloadUrl',
  ],
};

async function compile(data) {
  const { code } = data;

  const resources = [];

  const dependencies = [];

  function addDependency(depPath: string) {
    if (!isUrl(depPath)) {
      let assetPath = decodeURIComponent(depPath);
      if (/^\w/.test(assetPath)) {
        assetPath = `./${assetPath}`;
      }

      dependencies.push({
        path: assetPath,
        isEntry: true,
      });

      resources.push(assetPath);

      return assetPath;
    }
    return false;
  }

  function addSrcSetDependencies(srcset: string) {
    const newSources = [];

    srcset.split(',').forEach(source => {
      const pair = source.trim().split(' ');
      if (pair.length === 0) return;
      const addedDependency = addDependency(pair[0]);
      if (addedDependency) {
        pair[0] = addedDependency;
      }
      newSources.push(pair.join(' '));
    });
    return newSources.join(',');
  }

  const res = parse(code, { lowerCaseAttributeNames: true });
  res.walk = api.walk;
  res.match = api.match;

  res.walk(node => {
    if (node == null) {
      return node;
    }

    if (node.attrs) {
      if (node.tag === 'meta') {
        if (
          !Object.keys(node.attrs).some(attr => {
            const values = META[attr];
            return values && values.includes(node.attrs[attr]);
          })
        ) {
          return node;
        }
      }

      /* eslint-disable no-param-reassign no-continue */
      // eslint-disable-next-line no-restricted-syntax
      for (const attr in node.attrs) {
        if (Object.prototype.hasOwnProperty.call(node.attrs, attr)) {
          if (node.tag === 'img' && attr === 'srcset') {
            node.attrs[attr] = addSrcSetDependencies(node.attrs[attr]);
            continue;
          }
          const elements = ATTRS[attr];
          // Check for virtual paths
          if (
            (node.tag === 'a' && node.attrs[attr].lastIndexOf('.') < 1) ||
            node.attrs[attr].endsWith('.html')
          ) {
            continue;
          }

          if (
            node.tag === 'html' &&
            node.attrs[attr].endsWith('.html') &&
            attr === 'href'
          ) {
            // Another HTML file, we'll compile it when the user goes to it
            continue;
          }

          if (elements && elements.includes(node.tag)) {
            const result = addDependency(node.attrs[attr]);

            if (result) {
              if (node.tag === 'link' || node.tag === 'script') {
                node.tag = false;
                node.content = [];
              } else {
                node.attrs[attr] = result;
              }
            }
          }
        }
      }
    }

    return node;
  });

  let compiledCode = ``;

  compiledCode += '\n';
  compiledCode += 'function loadResources() {';
  resources.forEach(resource => {
    const resourcePath = JSON.stringify(resource);
    compiledCode += `\n`;
    compiledCode += `\trequire(${resourcePath});\n`;
  });
  compiledCode += '\n}';

  compiledCode += `
if (document.readyState !== 'complete') {
  window.addEventListener('load', function() { loadResources() });
} else {
  loadResources();
}

`;

  return {
    transpiledCode: compiledCode,
    foundDependencies: dependencies,
  };
}

childHandler.registerFunction('compile', compile);
childHandler.emitReady();
