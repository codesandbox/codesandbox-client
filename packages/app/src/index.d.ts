// This ensures the global window object contains BrowserFS in its type
// Previously it was handled as a side effect of importing a module from standalone-packages/codesandbox-browserfs
import '../../../standalone-packages/codesandbox-browserfs/dist/browserfs';
