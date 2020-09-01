import { Module } from '@codesandbox/common/lib/types';

export enum OptionTypes {
  CaseSensitive = 'caseSensitive',
  Regex = 'regex',
  MathFullWord = 'matchFullWord',
}

export type Options = {
  [key in OptionTypes]: boolean;
};

export const SearchSandbox = (
  term: string,
  modules: Module[],
  options: Options
) => {
  const searchable = modules.map(m => ({
    ...m,
    matches: [],
  }));
  function String2Regex(string: string) {
    if (!options.regex) return string;
    const one = string.match(/\/(.+)\/.*/);
    const two = string.match(/\/.+\/(.*)/);

    if (one && two) {
      return new RegExp(
        string.match(/\/(.+)\/.*/)[1],
        string.match(/\/.+\/(.*)/)[1]
      );
    }

    return string;
  }

  function getAllMatches(text: string, searchTerm: string | RegExp) {
    const searchStrLen = term.length;
    if (searchStrLen === 0) {
      return [];
    }
    let pointer = 0;
    let index = text.substring(pointer).search(searchTerm);
    const indices = [];

    while (index > -1) {
      indices.push([pointer + index, pointer + index + searchStrLen]);
      pointer += index + searchStrLen;
      index = text.substring(pointer).search(searchTerm);
    }
    return indices;
  }

  if (term && modules) {
    return searchable
      .map(file => {
        const searchTerm = String2Regex(
          options.caseSensitive ? term : term.toLowerCase()
        );
        const fileCode = options.caseSensitive
          ? file.code
          : file.code.toLocaleLowerCase();
        const s = fileCode.search(searchTerm);
        if (s !== -1) {
          const str = file.code.toLocaleLowerCase();
          const matches = getAllMatches(str, searchTerm);
          return {
            code: file.code,
            id: file.id,
            path: file.path,
            title: file.title,
            matches,
          };
        }

        return false;
      })
      .filter(exists => exists);
  }

  return [];
};
