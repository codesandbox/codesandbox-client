export default class SearchWorker {
  terminate() {
    close();
  }

  async search(term: string, modules: any[]) {
    const searchable = modules.map(m => ({
      ...m,
      matches: [],
    }));

    function String2Regex(s: any) {
      const one = s.match(/\/(.+)\/.*/);
      const two = s.match(/\/.+\/(.*)/);

      if (one && two) {
        return new RegExp(s.match(/\/(.+)\/.*/)[1], s.match(/\/.+\/(.*)/)[1]);
      }

      return s;
    }

    function getAllMatches(text: string, searchTerm: string) {
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
          const s = file.code
            .toLocaleLowerCase()
            .search(String2Regex(term.toLowerCase()));
          if (s !== -1) {
            const str = file.code.toLocaleLowerCase();
            const searchTerm = String2Regex(term.toLowerCase());
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
