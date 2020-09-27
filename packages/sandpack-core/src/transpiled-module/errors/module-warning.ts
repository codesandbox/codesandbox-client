import { TranspiledModule } from '../transpiled-module';
import { WarningStructure } from '../../transpiler/utils/worker-warning-handler';

export default class ModuleWarning extends Error {
  constructor(module: TranspiledModule, warning: WarningStructure) {
    super();

    this.name = 'ModuleWarning';
    this.path = warning.fileName || module.module.path;
    this.message = warning.message;
    this.warning = warning.message;
    this.lineNumber = warning.lineNumber;
    this.columnNumber = warning.columnNumber;
    this.severity = warning.severity || 'warning';
    this.source = warning.source;
  }

  serialize(): WarningStructure {
    return {
      name: 'ModuleWarning',
      message: this.message,
      fileName: this.path,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      source: this.source,
      severity: this.severity,
    };
  }

  path: string;
  message: string;
  warning: string;
  severity: 'notice' | 'warning';
  source?: string;
  lineNumber?: number;
  columnNumber?: number;
}
