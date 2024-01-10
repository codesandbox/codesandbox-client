import { actions, dispatch } from 'codesandbox-api';
import debounce from 'lodash-es/debounce';
// @ts-ignore
// eslint-disable-next-line
import LinterWorker from 'worker-loader?publicPath=/&name=monaco-linter.[hash:8].worker.js!./LinterWorker';

import { getCurrentModelPath } from './utils';

const requireAMDModule = paths =>
  new Promise<void>(resolve => (window as any).require(paths, () => resolve()));

export class Linter {
  private worker: LinterWorker;
  private editor;
  private monaco;
  private isDisposed: boolean = false;
  constructor(editor, monaco) {
    this.editor = editor;
    this.monaco = monaco;
    this.worker = new LinterWorker();

    // This should be disposed?
    this.worker.addEventListener('message', this.onMessage);
  }

  dispose(): null {
    this.clearErrors();
    this.worker.removeEventListener('message', this.onMessage);
    this.worker.terminate();
    this.isDisposed = true;

    return null;
  }

  private clearErrors = () => {
    dispatch(
      actions.correction.clear(getCurrentModelPath(this.editor), 'eslint')
    );
  };

  private onMessage = event => {
    const { markers, version } = event.data;
    const activeEditor = this.editor.getActiveCodeEditor();

    if (activeEditor && activeEditor.getModel()) {
      this.clearErrors();

      if (version === activeEditor.getModel().getVersionId()) {
        markers.forEach(marker => {
          dispatch(
            actions.correction.show(marker.message, {
              line: marker.startLineNumber,
              column: marker.startColumn,
              lineEnd: marker.endLineNumber,
              columnEnd: marker.endColumn,
              source: 'eslint',
              severity: marker.severity === 2 ? 'warning' : 'notice',
              path: getCurrentModelPath(this.editor),
            })
          );
        });
      }
    }
  };

  lint = debounce(
    async (
      code: string,
      title: string,
      version: number,
      template: string,
      dependencies: { [dep: string]: string }
    ) => {
      if (!title || this.isDisposed) {
        return;
      }

      const mode = (await this.getMonacoMode(title)) || '';

      if (
        ['javascript', 'typescript', 'typescriptreact', 'vue'].includes(mode)
      ) {
        this.worker.postMessage({
          code,
          title,
          version,
          template,
          dependencies,
        });
      }
    },
    100
  );

  private async getMonacoMode(title: string) {
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
          this.monaco.languages.getLanguages &&
          !this.monaco.languages.getLanguages().find(l => l.id === 'vue')
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
  }
}
