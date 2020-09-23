import { URI as Uri } from 'vscode-uri';
export declare enum FileType {
    /**
     * The file type is unknown.
     */
    Unknown = 0,
    /**
     * A regular file.
     */
    File = 1,
    /**
     * A directory.
     */
    Directory = 2,
    /**
     * A symbolic link to a file.
     */
    SymbolicLink = 64
}
export interface FileStat {
    /**
     * The type of the file, e.g. is a regular file, a directory, or symbolic link
     * to a file.
     */
    type: FileType;
    /**
     * The creation timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
     */
    ctime: number;
    /**
     * The modification timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
     */
    mtime: number;
    /**
     * The size in bytes.
     */
    size: number;
}
export interface FileService {
    readFile(uri: Uri): Thenable<Uint8Array>;
    stat(uri: Uri): Thenable<FileStat>;
}
export declare function isAbsolutePath(path: string): boolean;
export declare function resolvePath(uri: Uri, path: string): Uri;
export declare function normalizePath(parts: string[]): string;
export declare function joinPath(uri: Uri, ...paths: string[]): Uri;
