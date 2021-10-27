/**
 * Stack frame information.
 */
declare class StackFrame {
    /**
     * Level in the call stack. For the long stacks SDK may not report every function in a call stack.
     */
    level: number;
    /**
     * Method name.
     */
    method: string;
    /**
     * Name of the assembly (dll, jar, etc.) containing this function.
     */
    assembly: string;
    /**
     * File name or URL of the method implementation.
     */
    fileName: string;
    /**
     * Line number of the code implementation.
     */
    line: number;
    constructor();
}
export = StackFrame;
