declare module 'js-untar' {
  export type UntarredFiles = Array<{
    name: string;
    mode: string;
    uid: number;
    gid: number;
    size: number;
    mtime: number;
    checksum: number;
    type: string;
    linkname: string;
    ustarFormat: string;
    version: string;
    uname: string;
    gname: string;
    devmajor: number;
    devminor: number;
    namePrefix: string;
    buffer: ArrayBuffer;
  }>;

  declare function _default(buffer: ArrayBufferLike): Promise<UntarredFiles>;

  export default _default;
}
