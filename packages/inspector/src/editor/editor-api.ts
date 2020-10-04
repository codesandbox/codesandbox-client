import { TextOperation } from 'ot';
import { CodeRange } from '../common/fibers';
import { Disposable } from '../common/rpc/disposable';
import { Event } from '../common/rpc/event';
import { SpanSubscription } from './span-subscription';

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

  onDidChangeContent: Event<OnDidChangeContentEvent>;
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
