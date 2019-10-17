/// <reference types="node" />
import Config = require("./Config");
declare class Sender {
    private static TAG;
    private static ICACLS_PATH;
    private static POWERSHELL_PATH;
    private static ACLED_DIRECTORIES;
    private static ACL_IDENTITY;
    static WAIT_BETWEEN_RESEND: number;
    static MAX_BYTES_ON_DISK: number;
    static MAX_CONNECTION_FAILURES_BEFORE_WARN: number;
    static TEMPDIR_PREFIX: string;
    static OS_PROVIDES_FILE_PROTECTION: boolean;
    static USE_ICACLS: boolean;
    private _config;
    private _storageDirectory;
    private _onSuccess;
    private _onError;
    private _enableDiskRetryMode;
    private _numConsecutiveFailures;
    protected _resendInterval: number;
    protected _maxBytesOnDisk: number;
    constructor(config: Config, onSuccess?: (response: string) => void, onError?: (error: Error) => void);
    /**
    * Enable or disable offline mode
    */
    setDiskRetryMode(value: boolean, resendInterval?: number, maxBytesOnDisk?: number): void;
    send(payload: Buffer, callback?: (v: string) => void): void;
    saveOnCrash(payload: string): void;
    private _runICACLS(args, callback);
    private _runICACLSSync(args);
    private _getACLIdentity(callback);
    private _getACLIdentitySync();
    private _getACLArguments(directory, identity);
    private _applyACLRules(directory, callback);
    private _applyACLRulesSync(directory);
    private _confirmDirExists(directory, callback);
    /**
     * Computes the size (in bytes) of all files in a directory at the root level. Asynchronously.
     */
    private _getShallowDirectorySize(directory, callback);
    /**
     * Computes the size (in bytes) of all files in a directory at the root level. Synchronously.
     */
    private _getShallowDirectorySizeSync(directory);
    /**
     * Stores the payload as a json file on disk in the temp directory
     */
    private _storeToDisk(payload);
    /**
     * Stores the payload as a json file on disk using sync file operations
     * this is used when storing data before crashes
     */
    private _storeToDiskSync(payload);
    /**
     * Check for temp telemetry files
     * reads the first file if exist, deletes it and tries to send its load
     */
    private _sendFirstFileOnDisk();
    private _onErrorHelper(error);
}
export = Sender;
