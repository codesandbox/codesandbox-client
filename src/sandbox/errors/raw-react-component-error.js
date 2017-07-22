export default class RawReactComponentError extends Error {
  constructor(mainModule, importedModule) {
    super();

    this.payload = {
      importedModuleId: importedModule.id,
    };
    this.module = mainModule;
  }

  type = 'raw-react-component-import';
  severity = 'error';
  hideLine = true;
}
