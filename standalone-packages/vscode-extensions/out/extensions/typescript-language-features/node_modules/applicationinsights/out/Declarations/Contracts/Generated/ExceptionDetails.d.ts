import StackFrame = require('./StackFrame');
/**
 * Exception details of the exception in a chain.
 */
declare class ExceptionDetails {
    /**
     * In case exception is nested (outer exception contains inner one), the id and outerId properties are used to represent the nesting.
     */
    id: number;
    /**
     * The value of outerId is a reference to an element in ExceptionDetails that represents the outer exception
     */
    outerId: number;
    /**
     * Exception type name.
     */
    typeName: string;
    /**
     * Exception message.
     */
    message: string;
    /**
     * Indicates if full exception stack is provided in the exception. The stack may be trimmed, such as in the case of a StackOverflow exception.
     */
    hasFullStack: boolean;
    /**
     * Text describing the stack. Either stack or parsedStack should have a value.
     */
    stack: string;
    /**
     * List of stack frames. Either stack or parsedStack should have a value.
     */
    parsedStack: StackFrame[];
    constructor();
}
export = ExceptionDetails;
