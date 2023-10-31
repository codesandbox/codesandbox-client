import {ApiError, ErrorCode} from '../core/api_error';
import {default as Stats, FileType} from '../core/node_fs_stats';
import {SynchronousFileSystem, FileSystem, BFSCallback, FileSystemOptions} from '../core/file_system';
import {File} from '../core/file';
import {FileFlag, ActionType} from '../core/file_flag';
import {NoSyncFile} from '../generic/preload_file';
import {copyingSlice, bufferValidator} from '../core/util';
import * as path from 'path';

/**
 * @hidden
 */
const rockRidgeIdentifier = "IEEE_P1282";
/**
 * @hidden
 */
const enum VolumeDescriptorTypeCode {
  BootRecord = 0,
  PrimaryVolumeDescriptor = 1,
  SupplementaryVolumeDescriptor = 2,
  VolumePartitionDescriptor = 3,
  VolumeDescriptorSetTerminator = 255
}

/**
 * @hidden
 */
type TGetString = (d: Buffer, i: number, len: number) => string;

/**
 * @hidden
 */
function getASCIIString(data: Buffer, startIndex: number, length: number) {
  return data.toString('ascii', startIndex, startIndex + length).trim();
}

/**
 * @hidden
 */
function getJolietString(data: Buffer, startIndex: number, length: number): string {
  if (length === 1) {
    // Special: Root, parent, current directory are still a single byte.
    return String.fromCharCode(data[startIndex]);
  }
  // UTF16-BE, which isn't natively supported by NodeJS Buffers.
  // Length should be even, but pessimistically floor just in case.
  const pairs = Math.floor(length / 2);
  const chars = new Array(pairs);
  for (let i = 0; i < pairs; i++) {
    const pos = startIndex + (i << 1);
    chars[i] = String.fromCharCode(data[pos + 1] | (data[pos] << 8));
  }
  return chars.join('');
}

/**
 * @hidden
 */
function getDate(data: Buffer, startIndex: number): Date {
  const year = parseInt(getASCIIString(data, startIndex, 4), 10);
  const mon = parseInt(getASCIIString(data, startIndex + 4, 2), 10);
  const day = parseInt(getASCIIString(data, startIndex + 6, 2), 10);
  const hour = parseInt(getASCIIString(data, startIndex + 8, 2), 10);
  const min = parseInt(getASCIIString(data, startIndex + 10, 2), 10);
  const sec = parseInt(getASCIIString(data, startIndex + 12, 2), 10);
  const hundrethsSec = parseInt(getASCIIString(data, startIndex + 14, 2), 10);
  // Last is a time-zone offset, but JavaScript dates don't support time zones well.
  return new Date(year, mon, day, hour, min, sec, hundrethsSec * 100);
}

/**
 * @hidden
 */
function getShortFormDate(data: Buffer, startIndex: number): Date {
  const yearsSince1900 = data[startIndex];
  const month = data[startIndex + 1];
  const day = data[startIndex + 2];
  const hour = data[startIndex + 3];
  const minute = data[startIndex + 4];
  const second = data[startIndex + 5];
  // JavaScript's Date support isn't so great; ignore timezone.
  // const offsetFromGMT = this._data[24];
  return new Date(yearsSince1900, month - 1, day, hour, minute, second);
}

/**
 * @hidden
 */
function constructSystemUseEntry(bigData: Buffer, i: number): SystemUseEntry {
  const data = bigData.slice(i);
  const sue = new SystemUseEntry(data);
  switch (sue.signatureWord()) {
    case SystemUseEntrySignatures.CE:
      return new CEEntry(data);
    case SystemUseEntrySignatures.PD:
      return new  PDEntry(data);
    case SystemUseEntrySignatures.SP:
      return new SPEntry(data);
    case SystemUseEntrySignatures.ST:
      return new STEntry(data);
    case SystemUseEntrySignatures.ER:
      return new EREntry(data);
    case SystemUseEntrySignatures.ES:
      return new ESEntry(data);
    case SystemUseEntrySignatures.PX:
      return new PXEntry(data);
    case SystemUseEntrySignatures.PN:
      return new PNEntry(data);
    case SystemUseEntrySignatures.SL:
      return new SLEntry(data);
    case SystemUseEntrySignatures.NM:
      return new NMEntry(data);
    case SystemUseEntrySignatures.CL:
      return new CLEntry(data);
    case SystemUseEntrySignatures.PL:
      return new PLEntry(data);
    case SystemUseEntrySignatures.RE:
      return new REEntry(data);
    case SystemUseEntrySignatures.TF:
      return new TFEntry(data);
    case SystemUseEntrySignatures.SF:
      return new SFEntry(data);
    case SystemUseEntrySignatures.RR:
      return new RREntry(data);
    default:
      return sue;
  }
}

/**
 * @hidden
 */
function constructSystemUseEntries(data: Buffer, i: number, len: number, isoData: Buffer): SystemUseEntry[] {
  // If the remaining allocated space following the last recorded System Use Entry in a System
  // Use field or Continuation Area is less than four bytes long, it cannot contain a System
  // Use Entry and shall be ignored
  len = len - 4;
  let entries = new Array<SystemUseEntry>();
  while (i < len) {
    const entry = constructSystemUseEntry(data, i);
    const length = entry.length();
    if (length === 0) {
      // Invalid SU section; prevent infinite loop.
      return entries;
    }
    i += length;
    if (entry instanceof STEntry) {
      // ST indicates the end of entries.
      break;
    }
    if (entry instanceof CEEntry) {
      entries = entries.concat(entry.getEntries(isoData));
    } else {
      entries.push(entry);
    }
  }
  return entries;
}

/**
 * @hidden
 */
class VolumeDescriptor {
  protected _data: Buffer;
  constructor(data: Buffer) {
    this._data = data;
  }
  public type(): VolumeDescriptorTypeCode {
    return this._data[0];
  }
  public standardIdentifier(): string {
    return getASCIIString(this._data, 1, 5);
  }
  public version(): number {
    return this._data[6];
  }
  public data(): Buffer {
    return this._data.slice(7, 2048);
  }
}

/**
 * @hidden
 */
abstract class PrimaryOrSupplementaryVolumeDescriptor extends VolumeDescriptor {
  private _root: DirectoryRecord | null = null;
  constructor(data: Buffer) {
    super(data);
  }
  public systemIdentifier(): string {
    return this._getString32(8);
  }
  public volumeIdentifier(): string {
    return this._getString32(40);
  }
  public volumeSpaceSize(): number {
    return this._data.readUInt32LE(80);
  }
  public volumeSetSize(): number {
    return this._data.readUInt16LE(120);
  }
  public volumeSequenceNumber(): number {
    return this._data.readUInt16LE(124);
  }
  public logicalBlockSize(): number {
    return this._data.readUInt16LE(128);
  }
  public pathTableSize(): number {
    return this._data.readUInt32LE(132);
  }
  public locationOfTypeLPathTable(): number {
    return this._data.readUInt32LE(140);
  }
  public locationOfOptionalTypeLPathTable(): number {
    return this._data.readUInt32LE(144);
  }
  public locationOfTypeMPathTable(): number {
    return this._data.readUInt32BE(148);
  }
  public locationOfOptionalTypeMPathTable(): number {
    return this._data.readUInt32BE(152);
  }
  public rootDirectoryEntry(isoData: Buffer): DirectoryRecord {
    if (this._root === null) {
      this._root = this._constructRootDirectoryRecord(this._data.slice(156));
      this._root.rootCheckForRockRidge(isoData);
    }
    return this._root;
  }
  public volumeSetIdentifier(): string {
    return this._getString(190, 128);
  }
  public publisherIdentifier(): string {
    return this._getString(318, 128);
  }
  public dataPreparerIdentifier(): string {
    return this._getString(446, 128);
  }
  public applicationIdentifier(): string {
    return this._getString(574, 128);
  }
  public copyrightFileIdentifier(): string {
    return this._getString(702, 38);
  }
  public abstractFileIdentifier(): string {
    return this._getString(740, 36);
  }
  public bibliographicFileIdentifier(): string {
    return this._getString(776, 37);
  }
  public volumeCreationDate(): Date {
    return getDate(this._data, 813);
  }
  public volumeModificationDate(): Date {
    return getDate(this._data, 830);
  }
  public volumeExpirationDate(): Date {
    return getDate(this._data, 847);
  }
  public volumeEffectiveDate(): Date {
    return getDate(this._data, 864);
  }
  public fileStructureVersion(): number {
    return this._data[881];
  }
  public applicationUsed(): Buffer {
    return this._data.slice(883, 883 + 512);
  }
  public reserved(): Buffer {
    return this._data.slice(1395, 1395 + 653);
  }
  public abstract name(): string;
  protected abstract _constructRootDirectoryRecord(data: Buffer): DirectoryRecord;
  protected abstract _getString(idx: number, len: number): string;
  protected _getString32(idx: number): string {
    return this._getString(idx, 32);
  }
}

/**
 * @hidden
 */
class PrimaryVolumeDescriptor extends PrimaryOrSupplementaryVolumeDescriptor {
  constructor(data: Buffer) {
    super(data);
    if (this.type() !== VolumeDescriptorTypeCode.PrimaryVolumeDescriptor) {
      throw new ApiError(ErrorCode.EIO, `Invalid primary volume descriptor.`);
    }
  }
  public name() {
    return "ISO9660";
  }
  protected _constructRootDirectoryRecord(data: Buffer): DirectoryRecord {
    return new ISODirectoryRecord(data, -1);
  }
  protected _getString(idx: number, len: number): string {
    return this._getString(idx, len);
  }
}

/**
 * @hidden
 */
class SupplementaryVolumeDescriptor extends PrimaryOrSupplementaryVolumeDescriptor {
  constructor(data: Buffer) {
    super(data);
    if (this.type() !== VolumeDescriptorTypeCode.SupplementaryVolumeDescriptor) {
      throw new ApiError(ErrorCode.EIO, `Invalid supplementary volume descriptor.`);
    }
    const escapeSequence = this.escapeSequence();
    const third = escapeSequence[2];
    // Third character identifies what 'level' of the UCS specification to follow.
    // We ignore it.
    if (escapeSequence[0] !== 0x25 || escapeSequence[1] !== 0x2F ||
       (third !== 0x40 && third !== 0x43 && third !== 0x45)) {
      throw new ApiError(ErrorCode.EIO, `Unrecognized escape sequence for SupplementaryVolumeDescriptor: ${escapeSequence.toString()}`);
    }
  }
  public name() {
    return "Joliet";
  }
  public escapeSequence(): Buffer {
    return this._data.slice(88, 120);
  }
  protected _constructRootDirectoryRecord(data: Buffer): DirectoryRecord {
    return new JolietDirectoryRecord(data, -1);
  }
  protected _getString(idx: number, len: number): string {
    return getJolietString(this._data, idx, len);
  }
}

/**
 * @hidden
 */
const enum FileFlags {
  Hidden = 1,
  Directory = 1 << 1,
  AssociatedFile = 1 << 2,
  EARContainsInfo = 1 << 3,
  EARContainsPerms = 1 << 4,
  FinalDirectoryRecordForFile = 1 << 5
}

/**
 * @hidden
 */
abstract class DirectoryRecord {
  protected _data: Buffer;
  // Offset at which system use entries begin. Set to -1 if not enabled.
  protected _rockRidgeOffset: number;
  protected _suEntries: SystemUseEntry[] | null = null;
  private _fileOrDir: Buffer | Directory<DirectoryRecord> | null = null;
  constructor(data: Buffer, rockRidgeOffset: number) {
    this._data = data;
    this._rockRidgeOffset = rockRidgeOffset;
  }
  public hasRockRidge(): boolean {
    return this._rockRidgeOffset > -1;
  }
  public getRockRidgeOffset(): number {
    return this._rockRidgeOffset;
  }
  /**
   * !!ONLY VALID ON ROOT NODE!!
   * Checks if Rock Ridge is enabled, and sets the offset.
   */
  public rootCheckForRockRidge(isoData: Buffer): void {
    const dir = this.getDirectory(isoData);
    this._rockRidgeOffset = dir.getDotEntry(isoData)._getRockRidgeOffset(isoData);
    if (this._rockRidgeOffset > -1) {
      // Wipe out directory. Start over with RR knowledge.
      this._fileOrDir = null;
    }
  }
  public length(): number {
    return this._data[0];
  }
  public extendedAttributeRecordLength(): number {
    return this._data[1];
  }
  public lba(): number {
    return this._data.readUInt32LE(2) * 2048;
  }
  public dataLength(): number {
    return this._data.readUInt32LE(10);
  }
  public recordingDate(): Date {
    return getShortFormDate(this._data, 18);
  }
  public fileFlags(): number {
    return this._data[25];
  }
  public fileUnitSize(): number {
    return this._data[26];
  }
  public interleaveGapSize(): number {
    return this._data[27];
  }
  public volumeSequenceNumber(): number {
    return this._data.readUInt16LE(28);
  }
  public identifier(): string {
    return this._getString(33, this._data[32]);
  }
  public fileName(isoData: Buffer): string {
    if (this.hasRockRidge()) {
      const fn = this._rockRidgeFilename(isoData);
      if (fn !== null) {
        return fn;
      }
    }
    const ident = this.identifier();
    if (this.isDirectory(isoData)) {
      return ident;
    }
    // Files:
    // - MUST have 0x2E (.) separating the name from the extension
    // - MUST have 0x3B (;) separating the file name and extension from the version
    // Gets expanded to two-byte char in Unicode directory records.
    const versionSeparator = ident.indexOf(';');
    if (versionSeparator === -1) {
      // Some Joliet filenames lack the version separator, despite the standard
      // specifying that it should be there.
      return ident;
    } else if (ident[versionSeparator - 1] === '.') {
      // Empty extension. Do not include '.' in the filename.
      return ident.slice(0, versionSeparator - 1);
    } else {
      // Include up to version separator.
      return ident.slice(0, versionSeparator);
    }
  }
  public isDirectory(isoData: Buffer): boolean {
    let rv = Boolean(this.fileFlags() && FileFlags.Directory);
    // If it lacks the Directory flag, it may still be a directory if we've exceeded the directory
    // depth limit. Rock Ridge marks these as files and adds a special attribute.
    if (!rv && this.hasRockRidge()) {
      rv = this.getSUEntries(isoData).filter((e) => e instanceof CLEntry).length > 0;
    }
    return rv;
  }
  public isSymlink(isoData: Buffer): boolean {
    return this.hasRockRidge() && this.getSUEntries(isoData).filter((e) => e instanceof SLEntry).length > 0;
  }
  public getSymlinkPath(isoData: Buffer): string {
    let p = "";
    const entries = this.getSUEntries(isoData);
    const getStr = this._getGetString();
    for (const entry of entries) {
      if (entry instanceof SLEntry) {
        const components = entry.componentRecords();
        for (const component of components) {
          const flags = component.flags();
          if (flags & SLComponentFlags.CURRENT) {
            p += "./";
          } else if (flags & SLComponentFlags.PARENT) {
            p += "../";
          } else if (flags & SLComponentFlags.ROOT) {
            p += "/";
          } else {
            p += component.content(getStr);
            if (!(flags & SLComponentFlags.CONTINUE)) {
              p += '/';
            }
          }
        }
        if (!entry.continueFlag()) {
          // We are done with this link.
          break;
        }
      }
    }
    if (p.length > 1 && p[p.length - 1] === '/') {
      // Trim trailing '/'.
      return p.slice(0, p.length - 1);
    } else {
      return p;
    }
  }
  public getFile(isoData: Buffer): Buffer {
    if (this.isDirectory(isoData)) {
      throw new Error(`Tried to get a File from a directory.`);
    }
    if (this._fileOrDir === null) {
      this._fileOrDir = isoData.slice(this.lba(), this.lba() + this.dataLength());
    }
    return <Buffer> this._fileOrDir;
  }
  public getDirectory(isoData: Buffer): Directory<DirectoryRecord> {
    if (!this.isDirectory(isoData)) {
      throw new Error(`Tried to get a Directory from a file.`);
    }
    if (this._fileOrDir === null) {
      this._fileOrDir = this._constructDirectory(isoData);
    }
    return <Directory<this>> this._fileOrDir;
  }
  public getSUEntries(isoData: Buffer): SystemUseEntry[] {
    if (!this._suEntries) {
      this._constructSUEntries(isoData);
    }
    return this._suEntries!;
  }
  protected abstract _getString(i: number, len: number): string;
  protected abstract _getGetString(): TGetString;
  protected abstract _constructDirectory(isoData: Buffer): Directory<DirectoryRecord>;
  protected _rockRidgeFilename(isoData: Buffer): string | null {
    const nmEntries = <NMEntry[]> this.getSUEntries(isoData).filter((e) => e instanceof NMEntry);
    if (nmEntries.length === 0 || nmEntries[0].flags() & (NMFlags.CURRENT | NMFlags.PARENT)) {
      return null;
    }
    let str = '';
    const getString = this._getGetString();
    for (const e of nmEntries) {
      str += e.name(getString);
      if (!(e.flags() & NMFlags.CONTINUE)) {
        break;
      }
    }
    return str;
  }
  private _constructSUEntries(isoData: Buffer): void {
    let i = 33 + this._data[32];
    if (i % 2 === 1) {
      // Skip padding field.
      i++;
    }
    i += this._rockRidgeOffset;
    this._suEntries = constructSystemUseEntries(this._data, i, this.length(), isoData);
  }
  /**
   * !!ONLY VALID ON FIRST ENTRY OF ROOT DIRECTORY!!
   * Returns -1 if rock ridge is not enabled. Otherwise, returns the offset
   * at which system use fields begin.
   */
  private _getRockRidgeOffset(isoData: Buffer): number {
    // In the worst case, we get some garbage SU entries.
    // Fudge offset to 0 before proceeding.
    this._rockRidgeOffset = 0;
    const suEntries = this.getSUEntries(isoData);
    if (suEntries.length > 0) {
      const spEntry = suEntries[0];
      if (spEntry instanceof SPEntry && spEntry.checkBytesPass()) {
        // SUSP is in use.
        for (let i = 1; i < suEntries.length; i++) {
          const entry = suEntries[i];
          if (entry instanceof RREntry || (entry instanceof EREntry && entry.extensionIdentifier() === rockRidgeIdentifier)) {
            // Rock Ridge is in use!
            return spEntry.bytesSkipped();
          }
        }
      }
    }
    // Failed.
    this._rockRidgeOffset = -1;
    return -1;
  }
}

/**
 * @hidden
 */
class ISODirectoryRecord extends DirectoryRecord {
  constructor(data: Buffer, rockRidgeOffset: number) {
    super(data, rockRidgeOffset);
  }
  protected _getString(i: number, len: number): string {
    return getASCIIString(this._data, i, len);
  }
  protected _constructDirectory(isoData: Buffer): Directory<DirectoryRecord> {
    return new ISODirectory(this, isoData);
  }
  protected _getGetString(): TGetString {
    return getASCIIString;
  }
}

/**
 * @hidden
 */
class JolietDirectoryRecord extends DirectoryRecord {
  constructor(data: Buffer, rockRidgeOffset: number) {
    super(data, rockRidgeOffset);
  }
  protected _getString(i: number, len: number): string {
    return getJolietString(this._data, i, len);
  }
  protected _constructDirectory(isoData: Buffer): Directory<DirectoryRecord> {
    return new JolietDirectory(this, isoData);
  }
  protected _getGetString(): TGetString {
    return getJolietString;
  }
}

/**
 * @hidden
 */
const enum SystemUseEntrySignatures {
  CE = 0x4345,
  PD = 0x5044,
  SP = 0x5350,
  ST = 0x5354,
  ER = 0x4552,
  ES = 0x4553,
  PX = 0x5058,
  PN = 0x504E,
  SL = 0x534C,
  NM = 0x4E4D,
  CL = 0x434C,
  PL = 0x504C,
  RE = 0x5245,
  TF = 0x5446,
  SF = 0x5346,
  RR = 0x5252
}

/**
 * @hidden
 */
class SystemUseEntry {
  protected _data: Buffer;
  constructor(data: Buffer) {
    this._data = data;
  }
  public signatureWord(): SystemUseEntrySignatures {
    return this._data.readUInt16BE(0);
  }
  public signatureWordString(): string {
    return getASCIIString(this._data, 0, 2);
  }
  public length(): number {
    return this._data[2];
  }
  public suVersion(): number {
    return this._data[3];
  }
}

/**
 * Continuation entry.
 * @hidden
 */
class CEEntry extends SystemUseEntry {
  private _entries: SystemUseEntry[] | null = null;
  constructor(data: Buffer) {
    super(data);
  }
  /**
   * Logical block address of the continuation area.
   */
  public continuationLba(): number {
    return this._data.readUInt32LE(4);
  }
  /**
   * Offset into the logical block.
   */
  public continuationLbaOffset(): number {
    return this._data.readUInt32LE(12);
  }
  /**
   * Length of the continuation area.
   */
  public continuationLength(): number {
    return this._data.readUInt32LE(20);
  }
  public getEntries(isoData: Buffer): SystemUseEntry[] {
    if (!this._entries) {
      const start = this.continuationLba() * 2048 + this.continuationLbaOffset();
      this._entries = constructSystemUseEntries(isoData, start, this.continuationLength(), isoData);
    }
    return this._entries;
  }
}

/**
 * Padding entry.
 * @hidden
 */
class PDEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
}

/**
 * Identifies that SUSP is in-use.
 * @hidden
 */
class SPEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public checkBytesPass(): boolean {
    return this._data[4] === 0xBE && this._data[5] === 0xEF;
  }
  public bytesSkipped(): number {
    return this._data[6];
  }
}

/**
 * Identifies the end of the SUSP entries.
 * @hidden
 */
class STEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
}

/**
 * Specifies system-specific extensions to SUSP.
 * @hidden
 */
class EREntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public identifierLength(): number {
    return this._data[4];
  }
  public descriptorLength(): number {
    return this._data[5];
  }
  public sourceLength(): number {
    return this._data[6];
  }
  public extensionVersion(): number {
    return this._data[7];
  }
  public extensionIdentifier(): string {
    return getASCIIString(this._data, 8, this.identifierLength());
  }
  public extensionDescriptor(): string {
    return getASCIIString(this._data, 8 + this.identifierLength(), this.descriptorLength());
  }
  public extensionSource(): string {
    return getASCIIString(this._data, 8 + this.identifierLength() + this.descriptorLength(), this.sourceLength());
  }
}

/**
 * @hidden
 */
class ESEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public extensionSequence(): number {
    return this._data[4];
  }
}

/**
 * RockRidge: Marks that RockRidge is in use [deprecated]
 * @hidden
 */
class RREntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
}

/**
 * RockRidge: Records POSIX file attributes.
 * @hidden
 */
class PXEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public mode(): number {
    return this._data.readUInt32LE(4);
  }
  public fileLinks(): number {
    return this._data.readUInt32LE(12);
  }
  public uid(): number {
    return this._data.readUInt32LE(20);
  }
  public gid(): number {
    return this._data.readUInt32LE(28);
  }
  public inode(): number {
    return this._data.readUInt32LE(36);
  }
}

/**
 * RockRidge: Records POSIX device number.
 * @hidden
 */
class PNEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public devTHigh(): number {
    return this._data.readUInt32LE(4);
  }
  public devTLow(): number {
    return this._data.readUInt32LE(12);
  }
}

/**
 * RockRidge: Records symbolic link
 * @hidden
 */
class SLEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public flags(): number {
    return this._data[4];
  }
  public continueFlag(): number {
    return this.flags() & 0x1;
  }
  public componentRecords(): SLComponentRecord[] {
    const records = new Array<SLComponentRecord>();
    let i = 5;
    while (i < this.length()) {
      const record = new SLComponentRecord(this._data.slice(i));
      records.push(record);
      i += record.length();
    }
    return records;
  }
}

/**
 * @hidden
 */
const enum SLComponentFlags {
  CONTINUE = 1,
  CURRENT = 1 << 1,
  PARENT = 1 << 2,
  ROOT = 1 << 3
}

/**
 * @hidden
 */
class SLComponentRecord {
  private _data: Buffer;
  constructor(data: Buffer) {
    this._data = data;
  }
  public flags(): SLComponentFlags {
    return this._data[0];
  }
  public length(): number {
    return 2 + this.componentLength();
  }
  public componentLength(): number {
    return this._data[1];
  }
  public content(getString: TGetString): string {
    return getString(this._data, 2, this.componentLength());
  }
}

/**
 * @hidden
 */
const enum NMFlags {
  CONTINUE = 1,
  CURRENT = 1 << 1,
  PARENT = 1 << 2
}

/**
 * RockRidge: Records alternate file name
 * @hidden
 */
class NMEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public flags(): NMFlags {
    return this._data[4];
  }
  public name(getString: TGetString): string {
    return getString(this._data, 5, this.length() - 5);
  }
}

/**
 * RockRidge: Records child link
 * @hidden
 */
class CLEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public childDirectoryLba(): number {
    return this._data.readUInt32LE(4);
  }
}

/**
 * RockRidge: Records parent link.
 * @hidden
 */
class PLEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public parentDirectoryLba(): number {
    return this._data.readUInt32LE(4);
  }
}

/**
 * RockRidge: Records relocated directory.
 * @hidden
 */
class REEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
}

/**
 * @hidden
 */
const enum TFFlags {
  CREATION = 1,
  MODIFY = 1 << 1,
  ACCESS = 1 << 2,
  ATTRIBUTES = 1 << 3,
  BACKUP = 1 << 4,
  EXPIRATION = 1 << 5,
  EFFECTIVE = 1 << 6,
  LONG_FORM = 1 << 7
}

/**
 * RockRidge: Records file timestamps
 * @hidden
 */
class TFEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public flags(): number {
    return this._data[4];
  }
  public creation(): Date | null {
    if (this.flags() & TFFlags.CREATION) {
      if (this._longFormDates()) {
        return getDate(this._data, 5);
      } else {
        return getShortFormDate(this._data, 5);
      }
    } else {
      return null;
    }
  }
  public modify(): Date | null {
    if (this.flags() & TFFlags.MODIFY) {
      const previousDates = (this.flags() & TFFlags.CREATION) ? 1 : 0;
      if (this._longFormDates()) {
        return getDate(this._data, 5 + (previousDates * 17));
      } else {
        return getShortFormDate(this._data, 5 + (previousDates * 7));
      }
    } else {
      return null;
    }
  }
  public access(): Date | null {
    if (this.flags() & TFFlags.ACCESS) {
      let previousDates = (this.flags() & TFFlags.CREATION) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.MODIFY) ? 1 : 0;
      if (this._longFormDates()) {
        return getDate(this._data, 5 + (previousDates * 17));
      } else {
        return getShortFormDate(this._data, 5 + (previousDates * 7));
      }
    } else {
      return null;
    }
  }
  public backup(): Date | null {
    if (this.flags() & TFFlags.BACKUP) {
      let previousDates = (this.flags() & TFFlags.CREATION) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.MODIFY) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.ACCESS) ? 1 : 0;
      if (this._longFormDates()) {
        return getDate(this._data, 5 + (previousDates * 17));
      } else {
        return getShortFormDate(this._data, 5 + (previousDates * 7));
      }
    } else {
      return null;
    }
  }
  public expiration(): Date | null {
    if (this.flags() & TFFlags.EXPIRATION) {
      let previousDates = (this.flags() & TFFlags.CREATION) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.MODIFY) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.ACCESS) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.BACKUP) ? 1 : 0;
      if (this._longFormDates()) {
        return getDate(this._data, 5 + (previousDates * 17));
      } else {
        return getShortFormDate(this._data, 5 + (previousDates * 7));
      }
    } else {
      return null;
    }
  }
  public effective(): Date | null {
    if (this.flags() & TFFlags.EFFECTIVE) {
      let previousDates = (this.flags() & TFFlags.CREATION) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.MODIFY) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.ACCESS) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.BACKUP) ? 1 : 0;
      previousDates += (this.flags() & TFFlags.EXPIRATION) ? 1 : 0;
      if (this._longFormDates()) {
        return getDate(this._data, 5 + (previousDates * 17));
      } else {
        return getShortFormDate(this._data, 5 + (previousDates * 7));
      }
    } else {
      return null;
    }
  }
  private _longFormDates(): boolean {
    return Boolean(this.flags() && TFFlags.LONG_FORM);
  }
}

/**
 * RockRidge: File data in sparse format.
 * @hidden
 */
class SFEntry extends SystemUseEntry {
  constructor(data: Buffer) {
    super(data);
  }
  public virtualSizeHigh(): number {
    return this._data.readUInt32LE(4);
  }
  public virtualSizeLow(): number {
    return this._data.readUInt32LE(12);
  }
  public tableDepth(): number {
    return this._data[20];
  }
}

/**
 * @hidden
 */
abstract class Directory<T extends DirectoryRecord> {
  protected _record: T;
  private _fileList: string[] = [];
  private _fileMap: {[name: string]: T} = {};
  constructor(record: T, isoData: Buffer) {
    this._record = record;
    let i = record.lba();
    let iLimit = i + record.dataLength();
    if (!(record.fileFlags() & FileFlags.Directory)) {
      // Must have a CL entry.
      const cl = <CLEntry> record.getSUEntries(isoData).filter((e) => e instanceof CLEntry)[0];
      i = cl.childDirectoryLba() * 2048;
      iLimit = Infinity;
    }

    while (i < iLimit) {
      const len = isoData[i];
      // Zero-padding between sectors.
      // TODO: Could optimize this to seek to nearest-sector upon
      // seeing a 0.
      if (len === 0) {
        i++;
        continue;
      }
      const r = this._constructDirectoryRecord(isoData.slice(i));
      const fname = r.fileName(isoData);
      // Skip '.' and '..' entries.
      if (fname !== '\u0000' && fname !== '\u0001') {
        // Skip relocated entries.
        if (!r.hasRockRidge() || r.getSUEntries(isoData).filter((e) => e instanceof REEntry).length === 0) {
          this._fileMap[fname] = r;
          this._fileList.push(fname);
        }
      } else if (iLimit === Infinity) {
        // First entry contains needed data.
        iLimit = i + r.dataLength();
      }
      i += r.length();
    }
  }
  /**
   * Get the record with the given name.
   * Returns undefined if not present.
   */
  public getRecord(name: string): DirectoryRecord {
    return this._fileMap[name];
  }
  public getFileList(): string[] {
    return this._fileList;
  }
  public getDotEntry(isoData: Buffer): T {
    return this._constructDirectoryRecord(isoData.slice(this._record.lba()));
  }
  protected abstract _constructDirectoryRecord(data: Buffer): T;
}

/**
 * @hidden
 */
class ISODirectory extends Directory<ISODirectoryRecord> {
  constructor(record: ISODirectoryRecord, isoData: Buffer) {
    super(record, isoData);
  }
  protected _constructDirectoryRecord(data: Buffer): ISODirectoryRecord {
    return new ISODirectoryRecord(data, this._record.getRockRidgeOffset());
  }
}

/**
 * @hidden
 */
class JolietDirectory extends Directory<JolietDirectoryRecord> {
  constructor(record: JolietDirectoryRecord, isoData: Buffer) {
    super(record, isoData);
  }
  protected _constructDirectoryRecord(data: Buffer): JolietDirectoryRecord {
    return new JolietDirectoryRecord(data, this._record.getRockRidgeOffset());
  }
}

/**
 * Options for IsoFS file system instances.
 */
export interface IsoFSOptions {
  // The ISO file in a buffer.
  data: Buffer;
  // The name of the ISO (optional; used for debug messages / identification via getName()).
  name?: string;
}

/**
 * Mounts an ISO file as a read-only file system.
 *
 * Supports:
 * * Vanilla ISO9660 ISOs
 * * Microsoft Joliet and Rock Ridge extensions to the ISO9660 standard
 */
export default class IsoFS extends SynchronousFileSystem implements FileSystem {
  public static readonly Name = "IsoFS";

  public static readonly Options: FileSystemOptions = {
    data: {
      type: "object",
      description: "The ISO file in a buffer",
      validator: bufferValidator
    }
  };

  /**
   * Creates an IsoFS instance with the given options.
   */
  public static Create(opts: IsoFSOptions, cb: BFSCallback<IsoFS>): void {
    try {
      cb(null, new IsoFS(opts.data, opts.name));
    } catch (e) {
      cb(e);
    }
  }
  public static isAvailable(): boolean {
    return true;
  }

  private _data: Buffer;
  private _pvd: PrimaryOrSupplementaryVolumeDescriptor;
  private _root: DirectoryRecord;
  private _name: string;

  /**
   * **Deprecated. Please use IsoFS.Create() method instead.**
   *
   * Constructs a read-only file system from the given ISO.
   * @param data The ISO file in a buffer.
   * @param name The name of the ISO (optional; used for debug messages / identification via getName()).
   */
  private constructor(data: Buffer, name: string = "") {
    super();
    this._data = data;
    // Skip first 16 sectors.
    let vdTerminatorFound = false;
    let i = 16 * 2048;
    const candidateVDs = new Array<PrimaryOrSupplementaryVolumeDescriptor>();
    while (!vdTerminatorFound) {
      const slice = data.slice(i);
      const vd = new VolumeDescriptor(slice);
      switch (vd.type()) {
        case VolumeDescriptorTypeCode.PrimaryVolumeDescriptor:
          candidateVDs.push(new PrimaryVolumeDescriptor(slice));
          break;
        case VolumeDescriptorTypeCode.SupplementaryVolumeDescriptor:
          candidateVDs.push(new SupplementaryVolumeDescriptor(slice));
          break;
        case VolumeDescriptorTypeCode.VolumeDescriptorSetTerminator:
          vdTerminatorFound = true;
          break;
      }
      i += 2048;
    }
    if (candidateVDs.length === 0) {
      throw new ApiError(ErrorCode.EIO, `Unable to find a suitable volume descriptor.`);
    }
    candidateVDs.forEach((v) => {
      // Take an SVD over a PVD.
      if (!this._pvd || this._pvd.type() !== VolumeDescriptorTypeCode.SupplementaryVolumeDescriptor) {
        this._pvd = v;
      }
    });
    this._root = this._pvd.rootDirectoryEntry(data);
    this._name = name;
  }

  public getName(): string {
    let name = `IsoFS${this._name}${this._pvd ? `-${this._pvd.name()}` : ''}`;
    if (this._root && this._root.hasRockRidge()) {
      name += `-RockRidge`;
    }
    return name;
  }

  public diskSpace(path: string, cb: (total: number, free: number) => void): void {
    // Read-only file system.
    cb(this._data.length, 0);
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

  public statSync(p: string, isLstat: boolean): Stats {
    const record = this._getDirectoryRecord(p);
    if (record === null) {
      throw ApiError.ENOENT(p);
    }
    return this._getStats(p, record)!;
  }

  public openSync(p: string, flags: FileFlag, mode: number): File {
    // INVARIANT: Cannot write to RO file systems.
    if (flags.isWriteable()) {
      throw new ApiError(ErrorCode.EPERM, p);
    }
    // Check if the path exists, and is a file.
    const record = this._getDirectoryRecord(p);
    if (!record) {
      throw ApiError.ENOENT(p);
    } else if (record.isSymlink(this._data)) {
      return this.openSync(path.resolve(p, record.getSymlinkPath(this._data)), flags, mode);
    } else if (!record.isDirectory(this._data)) {
      const data = record.getFile(this._data);
      const stats = this._getStats(p, record)!;
      switch (flags.pathExistsAction()) {
        case ActionType.THROW_EXCEPTION:
        case ActionType.TRUNCATE_FILE:
          throw ApiError.EEXIST(p);
        case ActionType.NOP:
          return new NoSyncFile(this, p, flags, stats, data);
        default:
          throw new ApiError(ErrorCode.EINVAL, 'Invalid FileMode object.');
      }
    } else {
      throw ApiError.EISDIR(p);
    }
  }

  public readdirSync(path: string): string[] {
    // Check if it exists.
    const record = this._getDirectoryRecord(path);
    if (!record) {
      throw ApiError.ENOENT(path);
    } else if (record.isDirectory(this._data)) {
      return record.getDirectory(this._data).getFileList().slice(0);
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
      const fdCast = <NoSyncFile<IsoFS>> fd;
      const fdBuff = <Buffer> fdCast.getBuffer();
      if (encoding === null) {
        return copyingSlice(fdBuff);
      }
      return fdBuff.toString(encoding);
    } finally {
      fd.closeSync();
    }
  }

  private _getDirectoryRecord(path: string): DirectoryRecord | null {
    // Special case.
    if (path === '/') {
      return this._root;
    }
    const components = path.split('/').slice(1);
    let dir = this._root;
    for (const component of components) {
      if (dir.isDirectory(this._data)) {
        dir = dir.getDirectory(this._data).getRecord(component);
        if (!dir) {
          return null;
        }
      } else {
        return null;
      }
    }
    return dir;
  }

  private _getStats(p: string, record: DirectoryRecord): Stats | null {
    if (record.isSymlink(this._data)) {
      const newP = path.resolve(p, record.getSymlinkPath(this._data));
      const dirRec = this._getDirectoryRecord(newP);
      if (!dirRec) {
        return null;
      }
      return this._getStats(newP, dirRec);
    } else {
      const len = record.dataLength();
      let mode = 0x16D;
      const date = record.recordingDate().getTime();
      let atime = date;
      let mtime = date;
      let ctime = date;
      if (record.hasRockRidge()) {
        const entries = record.getSUEntries(this._data);
        for (const entry of entries) {
          if (entry instanceof PXEntry) {
            mode = entry.mode();
          } else if (entry instanceof TFEntry) {
            const flags = entry.flags();
            if (flags & TFFlags.ACCESS) {
              atime = entry.access()!.getTime();
            }
            if (flags & TFFlags.MODIFY) {
              mtime = entry.modify()!.getTime();
            }
            if (flags & TFFlags.CREATION) {
              ctime = entry.creation()!.getTime();
            }
          }
        }
      }
      // Mask out writeable flags. This is a RO file system.
      mode = mode & 0x16D;
      return new Stats(record.isDirectory(this._data) ? FileType.DIRECTORY : FileType.FILE, len, mode, atime, mtime, ctime);
    }
  }
}
