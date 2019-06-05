interface IModel {
  value: string;
  isDirty: boolean;
  path: string;
}

/**
 * This interface is responsible for managing all the files that are kept in memory. They are called
 * models, which is derived from the "model" concept in VSCode.
 *
 * Models contain all the information the editor needs to know that cannot be encoded in files. They contain
 * linting errors/warnings, custom decoration, last code state (so unsaved code) and everything else needed.
 *
 * We decided to make this an interface, as we have multiple editors (CodeMirror and VSCode). Both of these
 * editors already have the concept of models, and we want to keep them as source of truth. That's why we have
 * an interface that is implemented in two classes (CodeMirrorModelManager and VSCodeModelManager), these classes
 * will just forward to the model manager if VSCode/CodeMirror has it in memory. If the underlying source doesn't have the
 * model in memory we will just fetch from memory.
 */
export interface IModelManager {
  createModel(value: string): void;
}

// Live Operation comes in -> change code of file -> happens if the file is opened.
