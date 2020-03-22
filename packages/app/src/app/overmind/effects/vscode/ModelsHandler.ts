import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import {
  EditorSelection,
  Module,
  Sandbox,
  UserSelection,
} from '@codesandbox/common/lib/types';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';
import { indexToLineAndColumn } from 'app/overmind/utils/common';
import { actions, dispatch } from 'codesandbox-api';
import { css } from 'glamor';
import { TextOperation } from 'ot';

import { getCurrentModelPath } from './utils';

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
  event: any;
  model: any;
};

export type onSelectionChangeData = UserSelection;

export type OnOperationAppliedData = {
  moduleShortid: string;
  title: string;
  code: string;
  model: any;
};

export type OnFileChangeCallback = (data: OnFileChangeData) => void;

export type OnOperationAppliedCallback = (data: OnOperationAppliedData) => void;

export type ModuleModel = {
  changeListener: { dispose: Function };
  selections: any[];
  path: string;
  model: Promise<any>;
  comments: any[];
};

export class ModelsHandler {
  public isApplyingOperation: boolean = false;
  private moduleModels: { [path: string]: ModuleModel } = {};
  private modelAddedListener: { dispose: Function };
  private modelRemovedListener: { dispose: Function };
  private onChangeCallback: OnFileChangeCallback;
  private onOperationAppliedCallback: OnOperationAppliedCallback;
  private sandbox: Sandbox;
  private editorApi;
  private monaco;
  private userClassesGenerated = {};
  private userSelectionDecorations = {};

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
    Object.keys(this.moduleModels).forEach(path => {
      if (this.moduleModels[path].changeListener) {
        this.moduleModels[path].changeListener.dispose();
      }
    });
    this.moduleModels = {};

    return null;
  }

  public async revertModule(module: Module) {
    const fileModel = this.editorApi.textFileService
      .getFileModels()
      .find(
        fileModelItem =>
          fileModelItem.resource.path === '/sandbox' + module.path
      );

    if (fileModel) {
      fileModel.revert();
    }
  }

  public changeModule = async (module: Module) => {
    const moduleModel = this.getModuleModelByPath(module.path);

    if (getCurrentModelPath(this.editorApi) !== module.path) {
      await this.editorApi.openFile(module.path);
    }

    moduleModel.model = await this.editorApi.textFileService.models
      .loadOrCreate(this.monaco.Uri.file('/sandbox' + module.path))
      .then(textFileEditorModel => textFileEditorModel.load())
      .then(textFileEditorModel => textFileEditorModel.textEditorModel);

    this.updateUserSelections(module, moduleModel.selections);

    return moduleModel.model;
  };

  public async applyComments(
    commentThreadsByPath: {
      [path: string]: Array<{
        commentThreadId: string;
        range: [number, number];
      }>;
    },
    currentCommentThreadId: string
  ) {
    // When deleting the last reference of a file, there is no file and
    // no path to iterate through. We need to check existing module models
    // to clean out the decorations
    Object.keys(this.moduleModels).forEach(async path => {
      const moduleModel = this.moduleModels[path];
      if (
        moduleModel.comments.length &&
        !commentThreadsByPath[path.replace('/sandbox', '')]
      ) {
        const model = await moduleModel.model;

        if (!model) {
          return;
        }

        moduleModel.comments = model.deltaDecorations(moduleModel.comments, []);
      }
    });

    // Go through paths and add glyphs
    Object.keys(commentThreadsByPath).forEach(async path => {
      const moduleModel = this.getModuleModelByPath(path);
      const model = await moduleModel.model;

      if (!model) {
        return;
      }
      const commentThreads = commentThreadsByPath[path];

      const existingDecorationComments = moduleModel.comments;
      const newDecorationComments = this.createCommentDecorations(
        commentThreads,
        model,
        currentCommentThreadId
      );

      moduleModel.comments = model.deltaDecorations(
        existingDecorationComments,
        newDecorationComments
      );
    });
  }

  public async updateTabsPath(oldPath: string, newPath: string) {
    const oldModelPath = '/sandbox' + oldPath;
    const newModelPath = '/sandbox' + newPath;

    return Promise.all(
      Object.keys(this.moduleModels).map(async path => {
        if (oldModelPath === path && this.moduleModels[path].model) {
          const model = await this.moduleModels[path].model;

          // This runs remove/add automatically
          return this.editorApi.textFileService.move(
            model.uri,
            this.monaco.Uri.file(newModelPath)
          );
        }

        return Promise.resolve();
      })
    );
  }

  public async applyOperation(moduleShortid: string, operation: any) {
    const module = this.sandbox.modules.find(m => m.shortid === moduleShortid);

    if (!module) {
      return;
    }

    const moduleModel = this.getModuleModelByPath(module.path);

    const modelEditor = this.editorApi.editorService.editors.find(
      editor => editor.resource && editor.resource.path === moduleModel.path
    );

    // We keep a reference to the model on our own. We keep it as a
    // promise, because there might be multiple operations fired before
    // the model is actually resolved. This creates a "natural" queue
    if (!moduleModel.model) {
      if (modelEditor) {
        moduleModel.model = modelEditor.textModelReference.then(
          ref => ref.object.textEditorModel
        );
      } else {
        moduleModel.model = this.editorApi.textFileService.models
          .loadOrCreate(this.monaco.Uri.file(moduleModel.path))
          .then(model => model.textEditorModel);
      }
    }

    const model = await moduleModel.model;

    this.isApplyingOperation = true;
    this.applyOperationToModel(operation, false, model);
    this.isApplyingOperation = false;
    this.onOperationAppliedCallback({
      code: model.getValue(),
      moduleShortid: module.shortid,
      title: module.title,
      model,
    });
  }

  public async setModuleCode(module: Module) {
    const moduleModel = this.getModuleModelByPath(module.path);
    const model = await moduleModel.model;

    if (!model) {
      return;
    }

    const oldCode = model.getValue();
    const changeOperation = getTextOperation(oldCode, module.code);
    this.isApplyingOperation = true;
    this.applyOperationToModel(changeOperation, false, model);
    this.isApplyingOperation = false;
  }

  public clearUserSelections(userId: string) {
    const decorations = Object.keys(this.userSelectionDecorations).filter(d =>
      d.startsWith(userId)
    );
    Object.keys(this.moduleModels).forEach(async key => {
      const moduleModel = this.moduleModels[key];

      if (!moduleModel.model) {
        return;
      }

      const model = await moduleModel.model;

      decorations.forEach(decorationId => {
        if (decorationId.startsWith(userId + model.id)) {
          this.userSelectionDecorations[decorationId] = model.deltaDecorations(
            this.userSelectionDecorations[decorationId] || [],
            []
          );
        }
      });
    });
  }

  nameTagTimeouts: { [name: string]: number } = {};

  public async updateUserSelections(
    module,
    userSelections: EditorSelection[],
    showNameTag = true
  ) {
    const moduleModel = this.getModuleModelByPath(module);

    moduleModel.selections = userSelections;

    if (!moduleModel.model) {
      return;
    }

    const model = await moduleModel.model;
    const lines = model.getLinesContent() || [];

    userSelections.forEach((data: EditorSelection) => {
      const { userId } = data;

      const decorationId = userId + model.id + module.shortid;
      if (data.selection === null) {
        this.userSelectionDecorations[decorationId] = model.deltaDecorations(
          this.userSelectionDecorations[decorationId] || [],
          []
        );

        return;
      }

      const decorations: Array<{
        range: any;
        options: {
          className: string;
        };
      }> = [];
      const { selection, color, name } = data;

      const getCursorDecoration = (position, className) => {
        const cursorPos = indexToLineAndColumn(lines, position);

        return {
          range: new this.monaco.Range(
            cursorPos.lineNumber,
            cursorPos.column,
            cursorPos.lineNumber,
            cursorPos.column
          ),
          options: {
            className: `${this.userClassesGenerated[className]}`,
          },
        };
      };

      const getSelectionDecoration = (start, end, className) => {
        const from = indexToLineAndColumn(lines, start);
        const to = indexToLineAndColumn(lines, end);

        return {
          range: new this.monaco.Range(
            from.lineNumber,
            from.column,
            to.lineNumber,
            to.column
          ),
          options: {
            className: this.userClassesGenerated[className],
            stickiness: 3, // GrowsOnlyWhenTypingAfter
          },
        };
      };
      const prefix = color.join('-') + userId;
      const cursorClassName = prefix + '-cursor';
      const nameTagClassName = prefix + '-nametag';
      const secondaryCursorClassName = prefix + '-secondary-cursor';
      const selectionClassName = prefix + '-selection';
      const secondarySelectionClassName = prefix + '-secondary-selection';

      if (selection && color) {
        const nameStyles = {
          content: name,
          position: 'absolute',
          bottom: '100%',
          backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
          zIndex: 200,
          color:
            (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000 > 128
              ? 'rgba(0, 0, 0, 0.8)'
              : 'white',
          padding: '0 4px',
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          fontSize: '.75rem',
          fontWeight: 600,
          userSelect: 'none',
          pointerEvents: 'none',
          width: 'max-content',
          fontFamily: 'dm, Menlo, monospace',
        };
        if (!this.userClassesGenerated[cursorClassName]) {
          this.userClassesGenerated[cursorClassName] = `${css({
            display: 'inherit',
            position: 'absolute',
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
            width: '2px !important',
            height: '100%',
            cursor: 'text',
            zIndex: 200,
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

        if (!this.userClassesGenerated[nameTagClassName]) {
          this.userClassesGenerated[nameTagClassName] = `${css({
            ':before': {
              animation: `${fadeOut} 0.3s`,
              animationDelay: '1s',
              animationFillMode: 'forwards',
              opacity: 1,
              ...nameStyles,
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

        decorations.push(
          getCursorDecoration(selection.primary.cursorPosition, cursorClassName)
        );

        if (selection.primary.selection.length) {
          decorations.push(
            getSelectionDecoration(
              // @ts-ignore
              selection.primary.selection[0],
              // @ts-ignore
              selection.primary.selection[1],
              selectionClassName
            )
          );
        }

        if (selection.secondary.length) {
          selection.secondary.forEach(s => {
            decorations.push(
              getCursorDecoration(s.cursorPosition, secondaryCursorClassName)
            );

            if (s.selection.length) {
              decorations.push(
                getSelectionDecoration(
                  s.selection[0],
                  s.selection[1],
                  secondarySelectionClassName
                )
              );
            }
          });
        }
      }

      this.userSelectionDecorations[decorationId] = model.deltaDecorations(
        this.userSelectionDecorations[decorationId] || [],
        decorations
      );

      if (this.nameTagTimeouts[decorationId]) {
        clearTimeout(this.nameTagTimeouts[decorationId]);
      }
      // We don't want to show the nametag when the cursor changed, because
      // another user changed the code on top of it. Otherwise it would get
      // messy very fast.
      if (showNameTag && selection.source !== 'modelChange') {
        const decoration = model.deltaDecorations(
          [],
          [
            getCursorDecoration(
              selection.primary.cursorPosition,
              nameTagClassName
            ),
          ]
        );
        this.userSelectionDecorations[decorationId].push(decoration);
        this.nameTagTimeouts[decorationId] = window.setTimeout(() => {
          if (!model.isDisposed()) {
            // And now hide the nametag after 1.5s
            model.deltaDecorations([decoration], []);
          }
        }, 1500);
      }
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
    const modelCode = model.getValue();

    if (operation.baseLength !== modelCode.length) {
      throw new Error(
        "The base length of the operation doesn't match the length of the code"
      );
    }

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
        try {
          const module = resolveModule(
            model.uri.path.replace(/^\/sandbox/, ''),
            this.sandbox.modules,
            this.sandbox.directories
          );

          const moduleModel = this.getModuleModelByPath(module.path);

          moduleModel.model = model;
          moduleModel.changeListener = this.getModelContentChangeListener(
            this.sandbox,
            model
          );
          const newDecorationComments = this.createCommentDecorations(
            moduleModel.comments,
            model,
            null
          );
          moduleModel.comments = model.deltaDecorations(
            [],
            newDecorationComments
          );
        } catch (e) {
          // File does not exist anymore for some reason
        }
      }
    );

    this.modelRemovedListener = this.editorApi.textFileService.modelService.onModelRemoved(
      model => {
        if (this.moduleModels[model.uri.path]) {
          this.moduleModels[model.uri.path].changeListener.dispose();

          const csbPath = model.uri.path.replace('/sandbox', '');
          dispatch(actions.correction.clear(csbPath, 'eslint'));

          delete this.moduleModels[model.uri.path];
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
          event: e,
          model,
        });
      } catch (err) {
        // This can throw when a file is deleted and you add new code to it. When
        // saving it a new file is created
      }
    });
  }

  private getModuleModelByPath(path: string) {
    const fullPath = '/sandbox' + path;
    this.moduleModels[fullPath] = this.moduleModels[fullPath] || {
      changeListener: null,
      model: null,
      path: fullPath,
      selections: [],
      comments: [],
    };

    return this.moduleModels[fullPath];
  }

  private createCommentDecorations(
    commentThreadDecorations: Array<{
      commentThreadId: string;
      range: [number, number];
    }>,
    model: any,
    currentCommentThreadId: string | null
  ) {
    return commentThreadDecorations.map(commentThreadDecoration => {
      const isActive =
        commentThreadDecoration.commentThreadId === currentCommentThreadId;

      const lineAndColumn = indexToLineAndColumn(
        model.getLinesContent() || [],
        commentThreadDecoration.range[0]
      );
      return {
        range: new this.monaco.Range(
          lineAndColumn.lineNumber,
          1,
          lineAndColumn.lineNumber,
          1
        ),
        options: {
          isWholeLine: true,
          // comment-id- class needs to be the LAST class!
          glyphMarginClassName: `editor-comments-glyph ${
            isActive ? 'active-comment ' : ''
          }comment-id-${commentThreadDecoration.commentThreadId}`,
        },
      };
    });
  }
}
