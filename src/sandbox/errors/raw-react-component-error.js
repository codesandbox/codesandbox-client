export default class RawReactComponentError extends Error {
  constructor(importedModule) {
    super();

    this.payload = {
      importedModuleId: importedModule.id,
    };
  }

  type = 'raw-react-component-import';
  severity = 'error';
  hideLine = true;
}
