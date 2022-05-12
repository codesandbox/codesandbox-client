const requireAMDModule = paths =>
  new Promise<void>(resolve => (window as any).require(paths, () => resolve()));

export default async (title: string, monaco) => {
  if (title == null) return 'javascript';

  const kind = title.match(/\.([^.]*)$/);

  if (kind) {
    if (kind[1] === 'css') return 'css';
    if (kind[1] === 'scss') return 'scss';
    if (kind[1] === 'json') return 'json';
    if (kind[1] === 'html') return 'html';
    if (kind[1] === 'svelte') return 'html';
    if (kind[1] === 'vue') {
      if (
        monaco.languages.getLanguages &&
        !monaco.languages.getLanguages().find(l => l.id === 'vue')
      ) {
        await requireAMDModule(['vs/language/vue/monaco.contribution']);
      }
      return 'vue';
    }
    if (kind[1] === 'less') return 'less';
    if (kind[1] === 'md') return 'markdown';
    if (/jsx?$/.test(kind[1])) return 'javascript';
    if (/tsx?$/.test(kind[1])) return 'typescript';
  }

  return undefined;
};
