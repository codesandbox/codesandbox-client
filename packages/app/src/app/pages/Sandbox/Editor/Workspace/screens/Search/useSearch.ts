import { useEffect, useState } from 'react';
// import { Module } from '@codesandbox/common/lib/types';
import { useOvermind } from 'app/overmind';

export const useSearch = (term: string) => {
  const {
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();

  const [results, setResults] = useState([]);

  const searchable = currentSandbox.modules.map(m => ({
    ...m,
    matches: [],
  }));

  useEffect(() => {
    if (term && currentSandbox.modules) {
      const files = searchable
        .map(file => {
          const search = file.code
            .toLocaleLowerCase()
            .search(term.toLowerCase());
          if (search !== -1) {
            const str = file.code.toLocaleLowerCase();
            let lastMatch: number;
            const matches = [];
            lastMatch = str.indexOf(term);
            if (lastMatch >= 0) {
              matches.push([lastMatch, lastMatch + term.length]);
              lastMatch = str.indexOf(term, lastMatch + term.length);
              while (lastMatch >= 0) {
                matches.push([lastMatch, lastMatch + term.length]);
              }
            }

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
      setResults(files);
    }
  }, [term]);

  return results;
};
