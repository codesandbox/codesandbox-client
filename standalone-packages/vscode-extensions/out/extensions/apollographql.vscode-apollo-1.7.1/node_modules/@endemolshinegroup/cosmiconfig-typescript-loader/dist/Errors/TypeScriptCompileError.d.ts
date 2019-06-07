import { BaseError } from 'make-error';
export interface TypeScriptCompileErrorProps {
    message: string;
}
export default class TypeScriptCompileError extends BaseError {
    name: string;
    options: {};
    static fromError: (error: TypeScriptCompileErrorProps) => TypeScriptCompileError;
    constructor(message: string, options: {});
    toObject(): {
        message: string;
        name: string;
        stack: string;
    };
}
