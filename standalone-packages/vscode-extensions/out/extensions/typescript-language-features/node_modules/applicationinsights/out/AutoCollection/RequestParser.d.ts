/**
 * Base class for helpers that read data from HTTP requst/response objects and convert them
 * into the telemetry contract objects.
 */
declare abstract class RequestParser {
    protected method: string;
    protected url: string;
    protected startTime: number;
    protected duration: number;
    protected statusCode: number;
    protected properties: {
        [key: string]: string;
    };
    /**
     * Gets a url parsed out from request options
     */
    getUrl(): string;
    protected RequestParser(): void;
    protected _setStatus(status: number, error: Error | string): void;
    protected _isSuccess(): boolean;
}
export = RequestParser;
