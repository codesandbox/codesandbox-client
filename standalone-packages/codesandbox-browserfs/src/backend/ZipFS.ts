import {ApiError, ErrorCode} from '../core/api_error';
import {default as Stats, FileType} from '../core/node_fs_stats';
import {SynchronousFileSystem, FileSystem, BFSCallback, FileSystemOptions} from '../core/file_system';
import {File} from '../core/file';
import {FileFlag, ActionType} from '../core/file_flag';
import {NoSyncFile} from '../generic/preload_file';
import {Arrayish, arrayish2Buffer, copyingSlice, bufferValidator} from '../core/util';
import ExtendedASCII from '../generic/extended_ascii';
import setImmediate from '../generic/setImmediate';
/**
 * @hidden
 */
const inflateRaw:
  (data: Arrayish<number>, options?: {
    chunkSize: number;
  }) => Arrayish<number> = require('pako/lib/inflate').inflateRaw;
import {FileIndex, DirInode, FileInode, isDirInode, isFileInode} from '../generic/file_index';

/**
 * Maps CompressionMethod => function that decompresses.
 * @hidden
 */
const decompressionMethods: {[method: number]: (data: Buffer, compressedSize: number, uncompressedSize: number, flags: number) => Buffer} = {};

/**
 * 4.4.2.2: Indicates the compatibiltiy of a file's external attributes.
 */
export enum ExternalFileAttributeType {
  MSDOS = 0, AMIGA = 1, OPENVMS = 2, UNIX = 3, VM_CMS = 4, ATARI_ST = 5,
  OS2_HPFS = 6, MAC = 7, Z_SYSTEM = 8, CP_M = 9, NTFS = 10, MVS = 11, VSE = 12,
  ACORN_RISC = 13, VFAT = 14, ALT_MVS = 15, BEOS = 16, TANDEM = 17, OS_400 = 18,
  OSX = 19
}

/**
 * 4.4.5
 */
export enum CompressionMethod {
  STORED = 0,     // The file is stored (no compression)
  SHRUNK = 1,     // The file is Shrunk
  REDUCED_1 = 2,  // The file is Reduced with compression factor 1
  REDUCED_2 = 3,  // The file is Reduced with compression factor 2
  REDUCED_3 = 4,  // The file is Reduced with compression factor 3
  REDUCED_4 = 5,  // The file is Reduced with compression factor 4
  IMPLODE = 6,    // The file is Imploded
  DEFLATE = 8,    // The file is Deflated
  DEFLATE64 = 9,  // Enhanced Deflating using Deflate64(tm)
  TERSE_OLD = 10, // PKWARE Data Compression Library Imploding (old IBM TERSE)
  BZIP2 = 12,     // File is compressed using BZIP2 algorithm
  LZMA = 14,      // LZMA (EFS)
  TERSE_NEW = 18, // File is compressed using IBM TERSE (new)
  LZ77 = 19,      // IBM LZ77 z Architecture (PFS)
  WAVPACK = 97,   // WavPack compressed data
  PPMD = 98       // PPMd version I, Rev 1
}

/**
 * Converts the input time and date in MS-DOS format into a JavaScript Date
 * object.
 * @hidden
 */
function msdos2date(time: number, date: number): Date {
  // MS-DOS Date
  // |0 0 0 0  0|0 0 0  0|0 0 0  0 0 0 0
  //   D (1-31)  M (1-23)  Y (from 1980)
  const day = date & 0x1F;
  // JS date is 0-indexed, DOS is 1-indexed.
  const month = ((date >> 5) & 0xF) - 1;
  const year = (date >> 9) + 1980;
  // MS DOS Time
  // |0 0 0 0  0|0 0 0  0 0 0|0  0 0 0 0
  //    Second      Minute       Hour
  const second = time & 0x1F;
  const minute = (time >> 5) & 0x3F;
  const hour = time >> 11;
  return new Date(year, month, day, hour, minute, second);
}

/**
 * Safely returns the string from the buffer, even if it is 0 bytes long.
 * (Normally, calling toString() on a buffer with start === end causes an
 * exception).
 * @hidden
 */
function safeToString(buff: Buffer, useUTF8: boolean, start: number, length: number): string {
  if (length === 0) {
    return "";
  } else if (useUTF8) {
    return buff.toString('utf8', start, start + length);
  } else {
    return ExtendedASCII.byte2str(buff.slice(start, start + length));
  }
}

/*
   4.3.6 Overall .ZIP file format:

      [local file header 1]
      [encryption header 1]
      [file data 1]
      [data descriptor 1]
      .
      .
      .
      [local file header n]
      [encryption header n]
      [file data n]
      [data descriptor n]
      [archive decryption header]
      [archive extra data record]
      [central directory header 1]
      .
      .
      .
      [central directory header n]
      [zip64 end of central directory record]
      [zip64 end of central directory locator]
      [end of central directory record]
*/

/**
 * 4.3.7  Local file header:
 *
 *     local file header signature     4 bytes  (0x04034b50)
 *     version needed to extract       2 bytes
 *     general purpose bit flag        2 bytes
 *     compression method              2 bytes
 *    last mod file time              2 bytes
 *    last mod file date              2 bytes
 *    crc-32                          4 bytes
 *    compressed size                 4 bytes
 *    uncompressed size               4 bytes
 *    file name length                2 bytes
 *    extra field length              2 bytes
 *
 *    file name (variable size)
 *    extra field (variable size)
 */
export class FileHeader {
  constructor(private data: Buffer) {
    if (data.readUInt32LE(0) !== 0x04034b50) {
      throw new ApiError(ErrorCode.EINVAL, "Invalid Zip file: Local file header has invalid signature: " + this.data.readUInt32LE(0));
    }
  }
  public versionNeeded(): number { return this.data.readUInt16LE(4); }
  public flags(): number { return this.data.readUInt16LE(6); }
  public compressionMethod(): CompressionMethod { return this.data.readUInt16LE(8); }
  public lastModFileTime(): Date {
    // Time and date is in MS-DOS format.
    return msdos2date(this.data.readUInt16LE(10), this.data.readUInt16LE(12));
  }
  public rawLastModFileTime(): number {
    return this.data.readUInt32LE(10);
  }
  public crc32(): number { return this.data.readUInt32LE(14); }
  /**
   * These two values are COMPLETELY USELESS.
   *
   * Section 4.4.9:
   *   If bit 3 of the general purpose bit flag is set,
   *   these fields are set to zero in the local header and the
   *   correct values are put in the data descriptor and
   *   in the central directory.
   *
   * So we'll just use the central directory's values.
   */
  // public compressedSize(): number { return this.data.readUInt32LE(18); }
  // public uncompressedSize(): number { return this.data.readUInt32LE(22); }
  public fileNameLength(): number { return this.data.readUInt16LE(26); }
  public extraFieldLength(): number { return this.data.readUInt16LE(28); }
  public fileName(): string {
    return safeToString(this.data, this.useUTF8(), 30, this.fileNameLength());
  }
  public extraField(): Buffer {
    const start = 30 + this.fileNameLength();
    return this.data.slice(start, start + this.extraFieldLength());
  }
  public totalSize(): number { return 30 + this.fileNameLength() + this.extraFieldLength(); }
  public useUTF8(): boolean { return (this.flags() & 0x800) === 0x800; }
}

/**
 * 4.3.8  File data
 *
 *   Immediately following the local header for a file
 *   SHOULD be placed the compressed or stored data for the file.
 *   If the file is encrypted, the encryption header for the file
 *   SHOULD be placed after the local header and before the file
 *   data. The series of [local file header][encryption header]
 *   [file data][data descriptor] repeats for each file in the
 *   .ZIP archive.
 *
 *   Zero-byte files, directories, and other file types that
 *   contain no content MUST not include file data.
 */
export class FileData {
  constructor(private header: FileHeader, private record: CentralDirectory, private data: Buffer) {}
  public decompress(): Buffer {
    // Check the compression
    const compressionMethod: CompressionMethod = this.header.compressionMethod();
    const fcn = decompressionMethods[compressionMethod];
    if (fcn) {
      return fcn(this.data, this.record.compressedSize(), this.record.uncompressedSize(), this.record.flag());
    } else {
      let name: string = CompressionMethod[compressionMethod];
      if (!name) {
        name = `Unknown: ${compressionMethod}`;
      }
      throw new ApiError(ErrorCode.EINVAL, `Invalid compression method on file '${this.header.fileName()}': ${name}`);
    }
  }
  public getHeader(): FileHeader {
    return this.header;
  }
  public getRecord(): CentralDirectory {
    return this.record;
  }
  public getRawData(): Buffer {
    return this.data;
  }
}

/**
 * 4.3.9  Data descriptor:
 *
 *    crc-32                          4 bytes
 *    compressed size                 4 bytes
 *    uncompressed size               4 bytes
 */
export class DataDescriptor {
  constructor(private data: Buffer) {}
  public crc32(): number { return this.data.readUInt32LE(0); }
  public compressedSize(): number { return this.data.readUInt32LE(4); }
  public uncompressedSize(): number { return this.data.readUInt32LE(8); }
}

/*
` 4.3.10  Archive decryption header:

      4.3.10.1 The Archive Decryption Header is introduced in version 6.2
      of the ZIP format specification.  This record exists in support
      of the Central Directory Encryption Feature implemented as part of
      the Strong Encryption Specification as described in this document.
      When the Central Directory Structure is encrypted, this decryption
      header MUST precede the encrypted data segment.
 */
/**
 * 4.3.11  Archive extra data record:
 *
 *      archive extra data signature    4 bytes  (0x08064b50)
 *      extra field length              4 bytes
 *      extra field data                (variable size)
 *
 *    4.3.11.1 The Archive Extra Data Record is introduced in version 6.2
 *    of the ZIP format specification.  This record MAY be used in support
 *    of the Central Directory Encryption Feature implemented as part of
 *    the Strong Encryption Specification as described in this document.
 *    When present, this record MUST immediately precede the central
 *    directory data structure.
 */
export class ArchiveExtraDataRecord {
  constructor(private data: Buffer) {
    if (this.data.readUInt32LE(0) !== 0x08064b50) {
      throw new ApiError(ErrorCode.EINVAL, "Invalid archive extra data record signature: " + this.data.readUInt32LE(0));
    }
  }
  public length(): number { return this.data.readUInt32LE(4); }
  public extraFieldData(): Buffer { return this.data.slice(8, 8 + this.length()); }
}

/**
 * 4.3.13 Digital signature:
 *
 *      header signature                4 bytes  (0x05054b50)
 *      size of data                    2 bytes
 *      signature data (variable size)
 *
 *    With the introduction of the Central Directory Encryption
 *    feature in version 6.2 of this specification, the Central
 *    Directory Structure MAY be stored both compressed and encrypted.
 *    Although not required, it is assumed when encrypting the
 *    Central Directory Structure, that it will be compressed
 *    for greater storage efficiency.  Information on the
 *    Central Directory Encryption feature can be found in the section
 *    describing the Strong Encryption Specification. The Digital
 *    Signature record will be neither compressed nor encrypted.
 */
export class DigitalSignature {
  constructor(private data: Buffer) {
    if (this.data.readUInt32LE(0) !== 0x05054b50) {
      throw new ApiError(ErrorCode.EINVAL, "Invalid digital signature signature: " + this.data.readUInt32LE(0));
    }
  }
  public size(): number { return this.data.readUInt16LE(4); }
  public signatureData(): Buffer { return this.data.slice(6, 6 + this.size()); }
}

/**
 * 4.3.12  Central directory structure:
 *
 *  central file header signature   4 bytes  (0x02014b50)
 *  version made by                 2 bytes
 *  version needed to extract       2 bytes
 *  general purpose bit flag        2 bytes
 *  compression method              2 bytes
 *  last mod file time              2 bytes
 *  last mod file date              2 bytes
 *  crc-32                          4 bytes
 *  compressed size                 4 bytes
 *  uncompressed size               4 bytes
 *  file name length                2 bytes
 *  extra field length              2 bytes
 *  file comment length             2 bytes
 *  disk number start               2 bytes
 *  internal file attributes        2 bytes
 *  external file attributes        4 bytes
 *  relative offset of local header 4 bytes
 *
 *  file name (variable size)
 *  extra field (variable size)
 *  file comment (variable size)
 */
export class CentralDirectory {
  // Optimization: The filename is frequently read, so stash it here.
  private _filename: string;
  constructor(private zipData: Buffer, private data: Buffer) {
    // Sanity check.
    if (this.data.readUInt32LE(0) !== 0x02014b50) {
      throw new ApiError(ErrorCode.EINVAL, `Invalid Zip file: Central directory record has invalid signature: ${this.data.readUInt32LE(0)}`);
    }
    this._filename = this.produceFilename();
  }
  public versionMadeBy(): number { return this.data.readUInt16LE(4); }
  public versionNeeded(): number { return this.data.readUInt16LE(6); }
  public flag(): number { return this.data.readUInt16LE(8); }
  public compressionMethod(): CompressionMethod { return this.data.readUInt16LE(10); }
  public lastModFileTime(): Date {
    // Time and date is in MS-DOS format.
    return msdos2date(this.data.readUInt16LE(12), this.data.readUInt16LE(14));
  }
  public rawLastModFileTime(): number {
    return this.data.readUInt32LE(12);
  }
  public crc32(): number { return this.data.readUInt32LE(16); }
  public compressedSize(): number { return this.data.readUInt32LE(20); }
  public uncompressedSize(): number { return this.data.readUInt32LE(24); }
  public fileNameLength(): number { return this.data.readUInt16LE(28); }
  public extraFieldLength(): number { return this.data.readUInt16LE(30); }
  public fileCommentLength(): number { return this.data.readUInt16LE(32); }
  public diskNumberStart(): number { return this.data.readUInt16LE(34); }
  public internalAttributes(): number { return this.data.readUInt16LE(36); }
  public externalAttributes(): number { return this.data.readUInt32LE(38); }
  public headerRelativeOffset(): number { return this.data.readUInt32LE(42); }
  public produceFilename(): string {
    /*
      4.4.17.1 claims:
      * All slashes are forward ('/') slashes.
      * Filename doesn't begin with a slash.
      * No drive letters or any nonsense like that.
      * If filename is missing, the input came from standard input.

      Unfortunately, this isn't true in practice. Some Windows zip utilities use
      a backslash here, but the correct Unix-style path in file headers.

      To avoid seeking all over the file to recover the known-good filenames
      from file headers, we simply convert '/' to '\' here.
    */
    const fileName: string = safeToString(this.data, this.useUTF8(), 46, this.fileNameLength());
    return fileName.replace(/\\/g, "/");
  }
  public fileName(): string {
    return this._filename;
  }
  public rawFileName(): Buffer {
    return this.data.slice(46, 46 + this.fileNameLength());
  }
  public extraField(): Buffer {
    const start = 44 + this.fileNameLength();
    return this.data.slice(start, start + this.extraFieldLength());
  }
  public fileComment(): string {
    const start = 46 + this.fileNameLength() + this.extraFieldLength();
    return safeToString(this.data, this.useUTF8(), start, this.fileCommentLength());
  }
  public rawFileComment(): Buffer {
    const start = 46 + this.fileNameLength() + this.extraFieldLength();
    return this.data.slice(start, start + this.fileCommentLength());
  }
  public totalSize(): number {
    return 46 + this.fileNameLength() + this.extraFieldLength() + this.fileCommentLength();
  }
  public isDirectory(): boolean {
    // NOTE: This assumes that the zip file implementation uses the lower byte
    //       of external attributes for DOS attributes for
    //       backwards-compatibility. This is not mandated, but appears to be
    //       commonplace.
    //       According to the spec, the layout of external attributes is
    //       platform-dependent.
    //       If that fails, we also check if the name of the file ends in '/',
    //       which is what Java's ZipFile implementation does.
    const fileName = this.fileName();
    return (this.externalAttributes() & 0x10 ? true : false) || (fileName.charAt(fileName.length - 1) === '/');
  }
  public isFile(): boolean { return !this.isDirectory(); }
  public useUTF8(): boolean { return (this.flag() & 0x800) === 0x800; }
  public isEncrypted(): boolean { return (this.flag() & 0x1) === 0x1; }
  public getFileData(): FileData {
    // Need to grab the header before we can figure out where the actual
    // compressed data starts.
    const start = this.headerRelativeOffset();
    const header = new FileHeader(this.zipData.slice(start));
    return new FileData(header, this, this.zipData.slice(start + header.totalSize()));
  }
  public getData(): Buffer {
    return this.getFileData().decompress();
  }
  public getRawData(): Buffer {
    return this.getFileData().getRawData();
  }
  public getStats(): Stats {
    return new Stats(FileType.FILE, this.uncompressedSize(), 0x16D, Date.now(), this.lastModFileTime().getTime());
  }
}

/**
 * 4.3.16: end of central directory record
 *  end of central dir signature    4 bytes  (0x06054b50)
 *  number of this disk             2 bytes
 *  number of the disk with the
 *  start of the central directory  2 bytes
 *  total number of entries in the
 *  central directory on this disk  2 bytes
 *  total number of entries in
 *  the central directory           2 bytes
 *  size of the central directory   4 bytes
 *  offset of start of central
 *  directory with respect to
 *  the starting disk number        4 bytes
 *  .ZIP file comment length        2 bytes
 *  .ZIP file comment       (variable size)
 */
export class EndOfCentralDirectory {
  constructor(private data: Buffer) {
    if (this.data.readUInt32LE(0) !== 0x06054b50) {
      throw new ApiError(ErrorCode.EINVAL, `Invalid Zip file: End of central directory record has invalid signature: ${this.data.readUInt32LE(0)}`);
    }
  }
  public diskNumber(): number { return this.data.readUInt16LE(4); }
  public cdDiskNumber(): number { return this.data.readUInt16LE(6); }
  public cdDiskEntryCount(): number { return this.data.readUInt16LE(8); }
  public cdTotalEntryCount(): number { return this.data.readUInt16LE(10); }
  public cdSize(): number { return this.data.readUInt32LE(12); }
  public cdOffset(): number { return this.data.readUInt32LE(16); }
  public cdZipCommentLength(): number { return this.data.readUInt16LE(20); }
  public cdZipComment(): string {
    // Assuming UTF-8. The specification doesn't specify.
    return safeToString(this.data, true, 22, this.cdZipCommentLength());
  }
  public rawCdZipComment(): Buffer {
    return this.data.slice(22, 22 + this.cdZipCommentLength());
  }
}

/**
 * Contains the table of contents of a Zip file.
 */
export class ZipTOC {
  constructor(public index: FileIndex<CentralDirectory>, public directoryEntries: CentralDirectory[], public eocd: EndOfCentralDirectory, public data: Buffer) {
  }
}

/**
 * Configuration options for a ZipFS file system.
 */
export interface ZipFSOptions {
  // The zip file as a binary buffer.
  zipData: Buffer;
  // The name of the zip file (optional).
  name?: string;
}

/**
 * Zip file-backed filesystem
 * Implemented according to the standard:
 * http://www.pkware.com/documents/casestudies/APPNOTE.TXT
 *
 * While there are a few zip libraries for JavaScript (e.g. JSZip and zip.js),
 * they are not a good match for BrowserFS. In particular, these libraries
 * perform a lot of unneeded data copying, and eagerly decompress every file
 * in the zip file upon loading to check the CRC32. They also eagerly decode
 * strings. Furthermore, these libraries duplicate functionality already present
 * in BrowserFS (e.g. UTF-8 decoding and binary data manipulation).
 *
 * This filesystem takes advantage of BrowserFS's Buffer implementation, which
 * efficiently represents the zip file in memory (in both ArrayBuffer-enabled
 * browsers *and* non-ArrayBuffer browsers), and which can neatly be 'sliced'
 * without copying data. Each struct defined in the standard is represented with
 * a buffer slice pointing to an offset in the zip file, and has getters for
 * each field. As we anticipate that this data will not be read often, we choose
 * not to store each struct field in the JavaScript object; instead, to reduce
 * memory consumption, we retrieve it directly from the binary data each time it
 * is requested.
 *
 * When the filesystem is instantiated, we determine the directory structure
 * of the zip file as quickly as possible. We lazily decompress and check the
 * CRC32 of files. We do not cache decompressed files; if this is a desired
 * feature, it is best implemented as a generic file system wrapper that can
 * cache data from arbitrary file systems.
 *
 * For inflation, we use `pako`'s implementation:
 * https://github.com/nodeca/pako
 *
 * Current limitations:
 * * No encryption.
 * * No ZIP64 support.
 * * Read-only.
 *   Write support would require that we:
 *   - Keep track of changed/new files.
 *   - Compress changed files, and generate appropriate metadata for each.
 *   - Update file offsets for other files in the zip file.
 *   - Stream it out to a location.
 *   This isn't that bad, so we might do this at a later date.
 */
export default class ZipFS extends SynchronousFileSystem implements FileSystem {
  public static readonly Name = "ZipFS";

  public static readonly Options: FileSystemOptions = {
    zipData: {
      type: "object",
      description: "The zip file as a Buffer object.",
      validator: bufferValidator
    },
    name: {
      type: "string",
      optional: true,
      description: "The name of the zip file (optional)."
    }
  };

  public static readonly CompressionMethod = CompressionMethod;

  /**
   * Constructs a ZipFS instance with the given options.
   */
  public static Create(opts: ZipFSOptions, cb: BFSCallback<ZipFS>): void {
    try {
      ZipFS._computeIndex(opts.zipData, (e, zipTOC?) => {
        if (zipTOC) {
          const fs = new ZipFS(zipTOC, opts.name);
          cb(null, fs);
        } else {
          cb(e);
        }
      });
    } catch (e) {
      cb(e);
    }
  }

  public static isAvailable(): boolean { return true; }

  public static RegisterDecompressionMethod(m: CompressionMethod, fcn: (data: Buffer, compressedSize: number, uncompressedSize: number, flags: number) => Buffer): void {
    decompressionMethods[m] = fcn;
  }

  /**
   * Locates the end of central directory record at the end of the file.
   * Throws an exception if it cannot be found.
   */
  private static _getEOCD(data: Buffer): EndOfCentralDirectory {
    // Unfortunately, the comment is variable size and up to 64K in size.
    // We assume that the magic signature does not appear in the comment, and
    // in the bytes between the comment and the signature. Other ZIP
    // implementations make this same assumption, since the alternative is to
    // read thread every entry in the file to get to it. :(
    // These are *negative* offsets from the end of the file.
    const startOffset = 22;
    const endOffset = Math.min(startOffset + 0xFFFF, data.length - 1);
    // There's not even a byte alignment guarantee on the comment so we need to
    // search byte by byte. *grumble grumble*
    for (let i = startOffset; i < endOffset; i++) {
      // Magic number: EOCD Signature
      if (data.readUInt32LE(data.length - i) === 0x06054b50) {
        return new EndOfCentralDirectory(data.slice(data.length - i));
      }
    }
    throw new ApiError(ErrorCode.EINVAL, "Invalid ZIP file: Could not locate End of Central Directory signature.");
  }

  private static _addToIndex(cd: CentralDirectory, index: FileIndex<CentralDirectory>) {
    // Paths must be absolute, yet zip file paths are always relative to the
    // zip root. So we append '/' and call it a day.
    let filename = cd.fileName();
    if (filename.charAt(0) === '/') {
      throw new ApiError(ErrorCode.EPERM, `Unexpectedly encountered an absolute path in a zip file. Please file a bug.`);
    }
    // XXX: For the file index, strip the trailing '/'.
    if (filename.charAt(filename.length - 1) === '/') {
      filename = filename.substr(0, filename.length - 1);
    }

    if (cd.isDirectory()) {
      index.addPathFast('/' + filename, new DirInode<CentralDirectory>(cd));
    } else {
      index.addPathFast('/' + filename, new FileInode<CentralDirectory>(cd));
    }
  }

  private static _computeIndex(data: Buffer, cb: BFSCallback<ZipTOC>) {
    try {
      const index: FileIndex<CentralDirectory> = new FileIndex<CentralDirectory>();
      const eocd: EndOfCentralDirectory = ZipFS._getEOCD(data);
      if (eocd.diskNumber() !== eocd.cdDiskNumber()) {
        return cb(new ApiError(ErrorCode.EINVAL, "ZipFS does not support spanned zip files."));
      }

      const cdPtr = eocd.cdOffset();
      if (cdPtr === 0xFFFFFFFF) {
        return cb(new ApiError(ErrorCode.EINVAL, "ZipFS does not support Zip64."));
      }
      const cdEnd = cdPtr + eocd.cdSize();
      ZipFS._computeIndexResponsive(data, index, cdPtr, cdEnd, cb, [], eocd);
    } catch (e) {
      cb(e);
    }
  }

  private static _computeIndexResponsiveTrampoline(data: Buffer, index: FileIndex<CentralDirectory>, cdPtr: number, cdEnd: number, cb: BFSCallback<ZipTOC>, cdEntries: CentralDirectory[], eocd: EndOfCentralDirectory) {
    try {
      ZipFS._computeIndexResponsive(data, index, cdPtr, cdEnd, cb, cdEntries, eocd);
    } catch (e) {
      cb(e);
    }
  }

  private static _computeIndexResponsive(data: Buffer, index: FileIndex<CentralDirectory>, cdPtr: number, cdEnd: number, cb: BFSCallback<ZipTOC>, cdEntries: CentralDirectory[], eocd: EndOfCentralDirectory) {
    if (cdPtr < cdEnd) {
      let count = 0;
      while (count++ < 200 && cdPtr < cdEnd) {
        const cd: CentralDirectory = new CentralDirectory(data, data.slice(cdPtr));
        ZipFS._addToIndex(cd, index);
        cdPtr += cd.totalSize();
        cdEntries.push(cd);
      }
      setImmediate(() => {
        ZipFS._computeIndexResponsiveTrampoline(data, index, cdPtr, cdEnd, cb, cdEntries, eocd);
      });
    } else {
      cb(null, new ZipTOC(index, cdEntries, eocd, data));
    }
  }

  private _index: FileIndex<CentralDirectory> = new FileIndex<CentralDirectory>();
  private _directoryEntries: CentralDirectory[] = [];
  private _eocd: EndOfCentralDirectory | null = null;
  private data: Buffer;

  private constructor(input: ZipTOC, private name: string = '') {
    super();
    this._index = input.index;
    this._directoryEntries = input.directoryEntries;
    this._eocd = input.eocd;
    this.data = input.data;
  }

  public getName(): string {
    return ZipFS.Name + (this.name !== '' ? ` ${this.name}` : '');
  }

  /**
   * Get the CentralDirectory object for the given path.
   */
  public getCentralDirectoryEntry(path: string): CentralDirectory {
    const inode = this._index.getInode(path);
    if (inode === null) {
      throw ApiError.ENOENT(path);
    }
    if (isFileInode<CentralDirectory>(inode)) {
      return inode.getData();
    } else if (isDirInode<CentralDirectory>(inode)) {
      return inode.getData()!;
    } else {
      // Should never occur.
      throw ApiError.EPERM(`Invalid inode: ${inode}`);
    }
  }

  public getCentralDirectoryEntryAt(index: number): CentralDirectory {
    const dirEntry = this._directoryEntries[index];
    if (!dirEntry) {
      throw new RangeError(`Invalid directory index: ${index}.`);
    }
    return dirEntry;
  }

  public getNumberOfCentralDirectoryEntries(): number {
    return this._directoryEntries.length;
  }

  public getEndOfCentralDirectory(): EndOfCentralDirectory | null {
    return this._eocd;
  }

  public diskSpace(path: string, cb: (total: number, free: number) => void): void {
    // Read-only file system.
    cb(this.data.length, 0);
  }

  public isReadOnly(): boolean {
    return true;
  }

  public supportsLinks(): boolean {
    return false;
  }

  public supportsProps(): boolean {
    return false;
  }

  public supportsSynch(): boolean {
    return true;
  }

  public statSync(path: string, isLstat: boolean): Stats {
    const inode = this._index.getInode(path);
    if (inode === null) {
      throw ApiError.ENOENT(path);
    }
    let stats: Stats;
    if (isFileInode<CentralDirectory>(inode)) {
      stats = inode.getData().getStats();
    } else if (isDirInode(inode)) {
      stats = inode.getStats();
    } else {
      throw new ApiError(ErrorCode.EINVAL, "Invalid inode.");
    }
    return stats;
  }

  public openSync(path: string, flags: FileFlag, mode: number): File {
    // INVARIANT: Cannot write to RO file systems.
    if (flags.isWriteable()) {
      throw new ApiError(ErrorCode.EPERM, path);
    }
    // Check if the path exists, and is a file.
    const inode = this._index.getInode(path);
    if (!inode) {
      throw ApiError.ENOENT(path);
    } else if (isFileInode<CentralDirectory>(inode)) {
      const cdRecord = inode.getData();
      const stats = cdRecord.getStats();
      switch (flags.pathExistsAction()) {
        case ActionType.THROW_EXCEPTION:
        case ActionType.TRUNCATE_FILE:
          throw ApiError.EEXIST(path);
        case ActionType.NOP:
          return new NoSyncFile(this, path, flags, stats, cdRecord.getData());
        default:
          throw new ApiError(ErrorCode.EINVAL, 'Invalid FileMode object.');
      }
    } else {
      throw ApiError.EISDIR(path);
    }
  }

  public readdirSync(path: string): string[] {
    // Check if it exists.
    const inode = this._index.getInode(path);
    if (!inode) {
      throw ApiError.ENOENT(path);
    } else if (isDirInode(inode)) {
      return inode.getListing();
    } else {
      throw ApiError.ENOTDIR(path);
    }
  }

  /**
   * Specially-optimized readfile.
   */
  public readFileSync(fname: string, encoding: string, flag: FileFlag): any {
    // Get file.
    const fd = this.openSync(fname, flag, 0x1a4);
    try {
      const fdCast = <NoSyncFile<ZipFS>> fd;
      const fdBuff = <Buffer> fdCast.getBuffer();
      if (encoding === null) {
        return copyingSlice(fdBuff);
      }
      return fdBuff.toString(encoding);
    } finally {
      fd.closeSync();
    }
  }
}

ZipFS.RegisterDecompressionMethod(CompressionMethod.DEFLATE, (data, compressedSize, uncompressedSize) => {
  return arrayish2Buffer(inflateRaw(
    data.slice(0, compressedSize),
    { chunkSize: uncompressedSize }
  ));
});

ZipFS.RegisterDecompressionMethod(CompressionMethod.STORED, (data, compressedSize, uncompressedSize) => {
  return copyingSlice(data, 0, uncompressedSize);
});
