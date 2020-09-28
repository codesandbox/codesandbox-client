import { Module } from '@codesandbox/common/lib/types';
import { Options } from '.';

export default class SearchWorker {
  async search(term: string, modules: Module[], options: Options) {
    const searchable = modules.map(m => ({
      ...m,
      matches: [],
    }));

    function searchString(s: string, termString: string) {
      if (options.regex) {
        try {
          return s.search(termString);
        } catch (e) {
          console.error(e);
          return s.indexOf(termString);
        }
      }
      return s.indexOf(termString);
    }

    function getAllMatches(text: string, searchTerm: string) {
      const searchStrLen = term.length;
      if (searchStrLen === 0) {
        return [];
      }
      let pointer = 0;
      let index = searchString(text.substring(pointer), searchTerm);
      const indices = [];

      while (index > -1) {
        indices.push([pointer + index, pointer + index + searchStrLen]);
        pointer += index + searchStrLen;
        index = searchString(text.substring(pointer), searchTerm);
      }
      return indices;
    }

    if (term && modules) {
      return searchable
        .map(file => {
          let s;
          if (options.caseSensitive) {
            s = searchString(file.code, term);
          } else {
            s = searchString(
              file.code.toLocaleLowerCase(),
              term.toLocaleLowerCase()
            );
          }

          if (s !== -1) {
            let str;
            let searchTerm;
            if (options.caseSensitive) {
              str = file.code;
              searchTerm = term;
            } else {
              str = file.code.toLocaleLowerCase();
              searchTerm = term.toLowerCase();
            }
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
  }
}
