import { Module } from '@codesandbox/common/lib/types';
import minimatch from 'minimatch';
import { OptionTypes } from 'app/overmind/namespaces/workspace/state';

type Options = {
  [OptionTypes.CaseSensitive]: boolean;
  [OptionTypes.Regex]: boolean;
  [OptionTypes.MatchFullWord]: boolean;
  filesToExclude: string;
  filesToInclude: string;
};

export default class SearchWorker {
  async search(term: string, modules: Module[], options: Options) {
    const { filesToExclude, filesToInclude, regex, caseSensitive } = options;

    let searchable: Module[] = modules
      .map(m => ({
        ...m,
        matches: [],
        open: false,
      }))
      // do not search binary files
      .filter(module => !module.isBinary);

    if (filesToInclude) {
      const matchesFiles = createIncludedFiles(filesToInclude, {
        nonegate: true,
      });

      searchable = searchable.filter(file => matchesFiles.includes(file.path));
    }

    if (filesToExclude) {
      const negateVersion = filesToExclude.startsWith('!')
        ? filesToExclude
        : '!' + filesToExclude;

      const matchesFiles = createIncludedFiles(negateVersion);

      searchable = searchable.filter(file => matchesFiles.includes(file.path));
    }

    function createIncludedFiles(glob: string, miniMatchOptions?: Object) {
      return searchable
        .map(file =>
          file.path.startsWith('/') ? file.path.substring(1) : file.path
        )
        .filter(
          minimatch.filter(glob, {
            matchBase: true,
            nocase: true,
            ...miniMatchOptions,
          })
        )
        .map(path => `/${path}`);
    }

    function searchString(s: string, termString: string) {
      if (regex) {
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
          let s: number;
          if (caseSensitive) {
            s = searchString(file.code, term);
          } else {
            s = searchString(
              file.code.toLocaleLowerCase(),
              term.toLocaleLowerCase()
            );
          }

          if (s !== -1) {
            let str: string;
            let searchTerm: string;
            if (caseSensitive) {
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
