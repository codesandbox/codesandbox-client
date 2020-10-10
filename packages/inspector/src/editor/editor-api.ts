import { TextOperation } from 'ot';
import { CodeRange, CodeSelection, CodePosition } from '../common/fibers';
import { Disposable } from '../common/rpc/disposable';
import { Event } from '../common/rpc/event';

export type Resource = {
  path: string;
  scheme: string;
};

export type OnDidChangeContentEvent = {
  operation: TextOperation;
};

/**
 * A model represents a text file that's opened. It's very similar to the VSCode/Monaco model, with
 * some small changes to make it work wih more editors.
 */
export interface IModel extends Disposable {
  getValue(): string;
  getValueInRange(range: CodeRange): string;
  getLinesContent(): string[];
  getResource(): Resource;
  /**
   * Get the unique version number of the document. On every change we increment the number (even for undos/redos)
   */
  getVersionId(): number;

  pushEditOperation(
    selections: CodeSelection[],
    operation: TextOperation
  ): CodeSelection[] | null;

  onDidChangeContent: Event<OnDidChangeContentEvent>;
}

export type OnDidChangeModelEvent = {
  model: IModel;
};

export type OnDidChangeCursorPositionEvent = {
  position: CodePosition;
};

export interface IEditor extends Disposable {
  onDidChangeModel: Event<OnDidChangeModelEvent>;
  onDidChangeCursorPosition: Event<OnDidChangeCursorPositionEvent>;

  getId(): string;
  getModel(): IModel;
}

export type OnModelAddedEvent = {
  model: IModel;
};
export type OnModelRemovedEvent = {
  model: IModel;
};

export interface IEditorInterface {
  onModelAdded: Event<OnModelAddedEvent>;
  onModelRemoved: Event<OnModelRemovedEvent>;

  getModels(): IModel[];
  openModel(resource: Resource): Promise<IModel>;

  setSelectionOnActiveEditor(range: CodeRange): Promise<void>;
}
