/*!
 * parse-gitignore <https://github.com/jonschlinkert/parse-gitignore>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

const gitignore = input => {
  return input.toString()
    .split(/\r?\n/)
    .filter(l => l.trim() !== '' && l.charAt(0) !== '#');
};

gitignore.parse = (input, fn = line => line) => {
  let lines = input.toString().split(/\r?\n/);
  let state = { patterns: [], sections: [] };
  let section = { name: 'default', patterns: [] };

  for (let line of lines) {
    if (line.charAt(0) === '#') {
      section = { name: line.slice(1).trim(), patterns: []};
      state.sections.push(section);
      continue;
    }

    if (line.trim() !== '') {
      let pattern = fn(line, section, state);
      section.patterns.push(pattern);
      state.patterns.push(pattern);
    }
  }
  return state;
};

gitignore.format = (section) => {
  return `# ${section.name}\n${section.patterns.join('\n')}\n\n`;
};

gitignore.stringify = (sections, fn = gitignore.format) => {
  let result = '';
  for (let section of [].concat(sections)) result += fn(section);
  return result.trim();
};

/**
 * Expose `gitignore`
 */

module.exports = gitignore;
