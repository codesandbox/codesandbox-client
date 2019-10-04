/**
 * Encapsulates options passed into client.flush() function
 */
interface FlushOptions {
    /**
     * Flag indicating whether application is crashing. When this flag is set to true
     * and storing data locally is enabled, Node.JS SDK will attempt to store data on disk
     */
    isAppCrashing?: boolean;
    /**
     * Callback that will be invoked with the response from server, in case of isAppCrashing set to true,
     * with immediate notification that data was stored
     */
    callback?: (v: string) => void;
}
export = FlushOptions;
