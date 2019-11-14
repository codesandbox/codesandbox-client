import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import {
  EditorSelection,
  Module,
  Sandbox,
  UserSelection,
} from '@codesandbox/common/lib/types';
import { indexToLineAndColumn } from 'app/overmind/utils/common';
import { actions, dispatch } from 'codesandbox-api';
import { css } from 'glamor';
import { TextOperation } from 'ot';

import { getCurrentModelPath, getModel } from './utils';

// @ts-ignore
const fadeIn = css.keyframes('fadeIn', {
  // optional name
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

// @ts-ignore
const fadeOut = css.keyframes('fadeOut', {
  // optional name
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

export type OnFileChangeData = {
  moduleShortid: string;
  title: string;
  code: string;
  model: any;
};

export type OnOperationAppliedData = {
  moduleShortid: string;
  title: string;
  code: string;
  model: any;
};

export type OnFileChangeCallback = (data: OnFileChangeData) => void;

export type OnOperationAppliedCallback = (data: OnOperationAppliedData) => void;

export class ModelsHandler {
  public isApplyingOperation: boolean = false;
  private modelAddedListener: { dispose: Function };
  private modelRemovedListener: { dispose: Function };
  private onChangeCallback: OnFileChangeCallback;
  private onOperationAppliedCallback: OnOperationAppliedCallback;
  private sandbox: Sandbox;
  private editorApi;
  private monaco;
  private userClassesGenerated = {};
  private userSelectionDecorations = {};
  private modelListeners: {
    [path: string]: {
      moduleShortid: string;
      model: any;
      listener: {
        dispose: Function;
      };
    };
  } = {};

  constructor(
    editorApi,
    monaco,
    sandbox: Sandbox,
    onChangeCallback: OnFileChangeCallback,
    onOperationAppliedCallback: OnOperationAppliedCallback
  ) {
    this.editorApi = editorApi;
    this.monaco = monaco;
    this.sandbox = sandbox;
    this.onChangeCallback = onChangeCallback;
    this.onOperationAppliedCallback = onOperationAppliedCallback;
    this.listenForChanges();
  }

  public dispose(): null {
    this.modelAddedListener.dispose();
    this.modelRemovedListener.dispose();
    Object.keys(this.modelListeners).forEach(p => {
      this.modelListeners[p].listener.dispose();
    });
    this.modelListeners = {};

    return null;
  }

  public changeModule = async (module: Module) => {
    if (getCurrentModelPath(this.editorApi) !== module.path) {
      const file = await this.editorApi.openFile(module.path);
      return file.getModel();
    }

    return Promise.resolve(getModel(this.editorApi));
  };

  public async applyOperation(moduleShortid: string, operation: any) {
    const module = this.sandbox.modules.find(m => m.shortid === moduleShortid);

    if (!module) {
      return;
    }

    const modulePath = '/sandbox' + module.path;

    const modelEditor = this.editorApi.editorService.editors.find(
      editor => editor.resource && editor.resource.path === modulePath
    );

    let model;

    if (modelEditor) {
      model = (await modelEditor.textModelReference).object;
    } else {
      model = await this.editorApi.textFileService.models.loadOrCreate(
        this.monaco.Uri.file(modulePath)
      );
    }

    this.isApplyingOperation = true;
    this.applyOperationToModel(operation, false, model.textEditorModel);
    this.isApplyingOperation = false;
    this.onOperationAppliedCallback({
      code: model.textEditorModel.getValue(),
      moduleShortid: module.shortid,
      title: module.title,
      model: model.textEditorModel,
    });
  }

  public updateUserSelections(
    module,
    userSelections: Array<UserSelection | EditorSelection>
  ) {
    const model = getModel(this.editorApi);

    if (!model) {
      return;
    }

    const lines = model.getLinesContent() || [];
    const activeEditor = this.editorApi.getActiveCodeEditor();

    userSelections.forEach((data: EditorSelection & UserSelection) => {
      const { userId } = data;

      const decorationId = module.shortid + userId;
      if (data.selection === null) {
        this.userSelectionDecorations[
          decorationId
        ] = activeEditor.deltaDecorations(
          this.userSelectionDecorations[decorationId] || [],
          [],
          data.userId
        );

        return;
      }

      const decorations = [];
      const { selection, color, name } = data;

      if (selection) {
        const addCursor = (position, className) => {
          const cursorPos = indexToLineAndColumn(lines, position);

          decorations.push({
            range: new this.monaco.Range(
              cursorPos.lineNumber,
              cursorPos.column,
              cursorPos.lineNumber,
              cursorPos.column
            ),
            options: {
              className: this.userClassesGenerated[className],
            },
          });
        };

        const addSelection = (start, end, className) => {
          const from = indexToLineAndColumn(lines, start);
          const to = indexToLineAndColumn(lines, end);

          decorations.push({
            range: new this.monaco.Range(
              from.lineNumber,
              from.column,
              to.lineNumber,
              to.column
            ),
            options: {
              className: this.userClassesGenerated[className],
            },
          });
        };

        const prefix = color.join('-') + userId;
        const cursorClassName = prefix + '-cursor';
        const secondaryCursorClassName = prefix + '-secondary-cursor';
        const selectionClassName = prefix + '-selection';
        const secondarySelectionClassName = prefix + '-secondary-selection';

        if (!this.userClassesGenerated[cursorClassName]) {
          const nameStyles = {
            content: name,
            position: 'absolute',
            top: -17,
            backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            zIndex: 20,
            color:
              color[0] + color[1] + color[2] > 500
                ? 'rgba(0, 0, 0, 0.8)'
                : 'white',
            padding: '2px 4px',
            borderRadius: 2,
            borderBottomLeftRadius: 0,
            fontSize: '.75rem',
            fontWeight: 600,
            userSelect: 'none',
            pointerEvents: 'none',
            width: 'max-content',
          };
          this.userClassesGenerated[cursorClassName] = `${css({
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
            width: '2px !important',
            cursor: 'text',
            zIndex: 30,
            ':before': {
              animation: `${fadeOut} 0.3s`,
              animationDelay: '1s',
              animationFillMode: 'forwards',
              opacity: 1,
              ...nameStyles,
            },
            ':hover': {
              ':before': {
                animation: `${fadeIn} 0.3s`,
                animationFillMode: 'forwards',
                opacity: 0,
                ...nameStyles,
              },
            },
          })}`;
        }

        if (!this.userClassesGenerated[secondaryCursorClassName]) {
          this.userClassesGenerated[secondaryCursorClassName] = `${css({
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`,
            width: '2px !important',
          })}`;
        }

        if (!this.userClassesGenerated[selectionClassName]) {
          this.userClassesGenerated[selectionClassName] = `${css({
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`,
            borderRadius: '3px',
            minWidth: 7.6,
          })}`;
        }

        if (!this.userClassesGenerated[secondarySelectionClassName]) {
          this.userClassesGenerated[secondarySelectionClassName] = `${css({
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`,
            borderRadius: '3px',
            minWidth: 7.6,
          })}`;
        }

        // These types are not working, have to figure this out
        // @ts-ignore
        addCursor(selection.primary.cursorPosition, cursorClassName);
        // @ts-ignore
        if (selection.primary.selection.length) {
          addSelection(
            // @ts-ignore
            selection.primary.selection[0],
            // @ts-ignore
            selection.primary.selection[1],
            selectionClassName
          );
        }

        // @ts-ignore
        if (selection.secondary.length) {
          // @ts-ignore
          selection.secondary.forEach(s => {
            addCursor(s.cursorPosition, secondaryCursorClassName);

            if (s.selection.length) {
              addSelection(
                s.selection[0],
                s.selection[1],
                secondarySelectionClassName
              );
            }
          });
        }
      }

      // Allow new model to attach in case it's attaching
      // Should ideally verify this, this is hacky
      requestAnimationFrame(() => {
        this.userSelectionDecorations[
          decorationId
        ] = activeEditor.deltaDecorations(
          this.userSelectionDecorations[decorationId] || [],
          decorations,
          userId
        );
      });
    });
  }

  private applyOperationToModel(
    operation,
    pushStack = false,
    model = this.editorApi.getActiveCodeEditor().getModel()
  ) {
    const results: Array<{
      range: unknown;
      text: string;
      forceMoveMarkers?: boolean;
    }> = [];
    let index = 0;
    const currentEOLLength = model.getEOL().length;
    let eolChanged = false;
    for (let i = 0; i < operation.ops.length; i++) {
      const op = operation.ops[i];
      if (TextOperation.isRetain(op)) {
        index += op;
      } else if (TextOperation.isInsert(op)) {
        const { lineNumber, column } = indexToLineAndColumn(
          model.getValue().split(/\n/) || [],
          index
        );
        const range = new this.monaco.Range(
          lineNumber,
          column,
          lineNumber,
          column
        );

        // if there's a new line
        if (/\n/.test(op)) {
          const eol = /\r\n/.test(op) ? 2 : 1;
          if (eol !== currentEOLLength) {
            // With this insert the EOL of the document changed on the other side. We need
            // to accomodate our EOL to it.
            eolChanged = true;
          }
        }

        results.push({
          range,
          text: op,
          forceMoveMarkers: true,
        });
      } else if (TextOperation.isDelete(op)) {
        const lines = model.getValue().split(/\n/) || [];
        const from = indexToLineAndColumn(lines, index);
        const to = indexToLineAndColumn(lines, index - op);
        results.push({
          range: new this.monaco.Range(
            from.lineNumber,
            from.column,
            to.lineNumber,
            to.column
          ),
          text: '',
        });
        index -= op;
      }
    }

    if (eolChanged) {
      const newEolMode = currentEOLLength === 2 ? 0 : 1;
      model.setEOL(newEolMode);
    }

    if (pushStack) {
      model.pushEditOperations([], results);
    } else {
      model.applyEdits(results);
    }
  }

  private listenForChanges() {
    this.modelAddedListener = this.editorApi.textFileService.modelService.onModelAdded(
      model => {
        if (this.modelListeners[model.uri.path] === undefined) {
          let module: Module;
          try {
            module = resolveModule(
              model.uri.path.replace(/^\/sandbox/, ''),
              this.sandbox.modules,
              this.sandbox.directories
            );
          } catch (e) {
            return;
          }

          const listener = this.getModelContentChangeListener(
            this.sandbox,
            model
          );

          this.modelListeners[model.uri.path] = {
            moduleShortid: module.shortid,
            model,
            listener,
          };
        }
      }
    );

    this.modelRemovedListener = this.editorApi.textFileService.modelService.onModelRemoved(
      model => {
        if (this.modelListeners[model.uri.path]) {
          this.modelListeners[model.uri.path].listener.dispose();

          const csbPath = model.uri.path.replace('/sandbox', '');
          dispatch(actions.correction.clear(csbPath, 'eslint'));

          delete this.modelListeners[model.uri.path];
        }
      }
    );
  }

  private getModelContentChangeListener(sandbox: Sandbox, model) {
    return model.onDidChangeContent(e => {
      if (this.isApplyingOperation) {
        return;
      }

      const { path } = model.uri;
      try {
        const module = resolveModule(
          path.replace(/^\/sandbox/, ''),
          sandbox.modules,
          sandbox.directories
        );

        this.onChangeCallback({
          moduleShortid: module.shortid,
          title: module.title,
          code: model.getValue(),
          model,
        });
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('caught', err);
        }
      }
    });
  }
}
