/**
 * The template from which `run.ts` is generated.
 *
 * Why autogenerate run.ts?
 * - Avoids hardcoding all test names. Now, adding a new test case is as simple as
 *   dropping a new file into the repository.
 * - Avoids hardcoding all backend factory names. (Ditto.)
 *
 * Previously, the code used RequireJS modules to dynamically grep for and require
 * tests and factories. However, Browserify does not allow you to have dynamic module
 * dependencies, as it prevents bundling. Thus, I compromised with this file.
 * (It's also less hacky, as now things will be typechecked at bundle-time. :) )
 */
import async_mirror from './factories/async_mirror_factory';
import dbfs from './factories/dbfs_factory';
import emscripten from './factories/emscripten_factory';
import folderadapter from './factories/folderadapter_factory';
import html5fs from './factories/html5fs_factory';
import httpdownloadfs from './factories/httpdownloadfs_factory';
import idbfs from './factories/idbfs_factory';
import inmemory from './factories/inmemory_factory';
import isofs from './factories/isofs_factory';
import lsfs from './factories/lsfs_factory';
import mfs from './factories/mfs_factory';
import overlay from './factories/overlay_factory';
import workerfs from './factories/workerfs_factory';
import zipfs from './factories/zipfs_factory';
const bad_lookupEmscripten = require('../tests/emscripten/bad_lookup');
const filesEmscripten = require('../tests/emscripten/files');
const nopEmscripten = require('../tests/emscripten/nop');
const readdirEmscripten = require('../tests/emscripten/readdir');
const readdir_emptyEmscripten = require('../tests/emscripten/readdir_empty');
import cache_test from '../tests/fs/Dropbox/cache_test';
import listing from '../tests/fs/HTTPRequest/listing';
import nested_directories from '../tests/fs/IsoFS/nested-directories';
import mounting from '../tests/fs/MountableFileSystem/mounting';
import delete_log_test from '../tests/fs/OverlayFS/delete-log-test';
import error_test from '../tests/fs/OverlayFS/error-test';
import persist_test from '../tests/fs/OverlayFS/persist-test';
import mkdir from '../tests/fs/all/mkdir';
import mode_test from '../tests/fs/all/mode-test';
import node_fs_append_file from '../tests/fs/all/node-fs-append-file';
import node_fs_chmod from '../tests/fs/all/node-fs-chmod';
import node_fs_error_messages from '../tests/fs/all/node-fs-error-messages';
import node_fs_exists from '../tests/fs/all/node-fs-exists';
import node_fs_fsync from '../tests/fs/all/node-fs-fsync';
import node_fs_long_path from '../tests/fs/all/node-fs-long-path';
import node_fs_mkdir from '../tests/fs/all/node-fs-mkdir';
import node_fs_null_bytes from '../tests/fs/all/node-fs-null-bytes';
import node_fs_open from '../tests/fs/all/node-fs-open';
import node_fs_read_buffer from '../tests/fs/all/node-fs-read-buffer';
import node_fs_read_file_sync from '../tests/fs/all/node-fs-read-file-sync';
import node_fs_read from '../tests/fs/all/node-fs-read';
import node_fs_readfile_empty from '../tests/fs/all/node-fs-readfile-empty';
import node_fs_readfile_unlink from '../tests/fs/all/node-fs-readfile-unlink';
import node_fs_stat from '../tests/fs/all/node-fs-stat';
import node_fs_symlink_dir_junction from '../tests/fs/all/node-fs-symlink-dir-junction';
import node_fs_symlink from '../tests/fs/all/node-fs-symlink';
import node_fs_truncate from '../tests/fs/all/node-fs-truncate';
import node_fs_utimes from '../tests/fs/all/node-fs-utimes';
import node_fs_write_buffer from '../tests/fs/all/node-fs-write-buffer';
import node_fs_write_file_buffer from '../tests/fs/all/node-fs-write-file-buffer';
import node_fs_write_file_sync from '../tests/fs/all/node-fs-write-file-sync';
import node_fs_write_file from '../tests/fs/all/node-fs-write-file';
import node_fs_write_sync from '../tests/fs/all/node-fs-write-sync';
import node_fs_write from '../tests/fs/all/node-fs-write';
import open from '../tests/fs/all/open';
import read_binary_file from '../tests/fs/all/read-binary-file';
import readFile from '../tests/fs/all/readFile';
import readdir from '../tests/fs/all/readdir';
import rename_test from '../tests/fs/all/rename-test';
import rmdir from '../tests/fs/all/rmdir';
import truncate from '../tests/fs/all/truncate';
import write_file from '../tests/fs/all/write-file';
import quota_test from '../tests/fs/localStorage/quota-test';
import buffer_test from '../tests/general/buffer-test';
import check_options_test from '../tests/general/check-options-test';
import indexed_fs_test from '../tests/general/indexed-fs-test';
import node_buffer_arraybuffer from '../tests/general/node-buffer-arraybuffer';
import node_buffer_ascii from '../tests/general/node-buffer-ascii';
import node_buffer_bytelength from '../tests/general/node-buffer-bytelength';
import node_buffer_concat from '../tests/general/node-buffer-concat';
import node_buffer_indexof from '../tests/general/node-buffer-indexof';
import node_buffer_inspect from '../tests/general/node-buffer-inspect';
import node_buffer_slow from '../tests/general/node-buffer-slow';
import node_buffer from '../tests/general/node-buffer';
import node_path_makelong from '../tests/general/node-path-makelong';
import node_path_zero_length_strings from '../tests/general/node-path-zero-length-strings';
import node_path from '../tests/general/node-path';
import std_streams from '../tests/general/std-streams';
import runTests from './setup';
import BackendFactory from './BackendFactory';

// Will be replaced with arrays of hardcoded require statements for the various modules.
const backends: BackendFactory[] = [async_mirror, dbfs, emscripten, folderadapter, html5fs, httpdownloadfs, idbfs, inmemory, isofs, lsfs, mfs, overlay, workerfs, zipfs],
  tests: {
    fs: {
      [name: string]: {[name: string]: () => void};
      all: {[name: string]: () => void};
    };
    general: {[name: string]: () => void};
    emscripten: {[name: string]: (Module: any) => void};
  } = {'emscripten':{'bad_lookup.js': bad_lookupEmscripten,'files.js': filesEmscripten,'nop.js': nopEmscripten,'readdir.js': readdirEmscripten,'readdir_empty.js': readdir_emptyEmscripten},'fs':{'Dropbox':{'cache_test.ts': cache_test},'HTTPRequest':{'listing.ts': listing},'IsoFS':{'nested-directories.ts': nested_directories},'MountableFileSystem':{'mounting.ts': mounting},'OverlayFS':{'delete-log-test.ts': delete_log_test,'error-test.ts': error_test,'persist-test.ts': persist_test},'all':{'mkdir.ts': mkdir,'mode-test.ts': mode_test,'node-fs-append-file.ts': node_fs_append_file,'node-fs-chmod.ts': node_fs_chmod,'node-fs-error-messages.ts': node_fs_error_messages,'node-fs-exists.ts': node_fs_exists,'node-fs-fsync.ts': node_fs_fsync,'node-fs-long-path.ts': node_fs_long_path,'node-fs-mkdir.ts': node_fs_mkdir,'node-fs-null-bytes.ts': node_fs_null_bytes,'node-fs-open.ts': node_fs_open,'node-fs-read-buffer.ts': node_fs_read_buffer,'node-fs-read-file-sync.ts': node_fs_read_file_sync,'node-fs-read.ts': node_fs_read,'node-fs-readfile-empty.ts': node_fs_readfile_empty,'node-fs-readfile-unlink.ts': node_fs_readfile_unlink,'node-fs-stat.ts': node_fs_stat,'node-fs-symlink-dir-junction.ts': node_fs_symlink_dir_junction,'node-fs-symlink.ts': node_fs_symlink,'node-fs-truncate.ts': node_fs_truncate,'node-fs-utimes.ts': node_fs_utimes,'node-fs-write-buffer.ts': node_fs_write_buffer,'node-fs-write-file-buffer.ts': node_fs_write_file_buffer,'node-fs-write-file-sync.ts': node_fs_write_file_sync,'node-fs-write-file.ts': node_fs_write_file,'node-fs-write-sync.ts': node_fs_write_sync,'node-fs-write.ts': node_fs_write,'open.ts': open,'read-binary-file.ts': read_binary_file,'readFile.ts': readFile,'readdir.ts': readdir,'rename-test.ts': rename_test,'rmdir.ts': rmdir,'truncate.ts': truncate,'write-file.ts': write_file},'localStorage':{'quota-test.ts': quota_test}},'general':{'buffer-test.ts': buffer_test,'check-options-test.ts': check_options_test,'indexed-fs-test.ts': indexed_fs_test,'node-buffer-arraybuffer.ts': node_buffer_arraybuffer,'node-buffer-ascii.ts': node_buffer_ascii,'node-buffer-bytelength.ts': node_buffer_bytelength,'node-buffer-concat.ts': node_buffer_concat,'node-buffer-indexof.ts': node_buffer_indexof,'node-buffer-inspect.ts': node_buffer_inspect,'node-buffer-slow.ts': node_buffer_slow,'node-buffer.ts': node_buffer,'node-path-makelong.ts': node_path_makelong,'node-path-zero-length-strings.ts': node_path_zero_length_strings,'node-path.ts': node_path,'std-streams.ts': std_streams}};

runTests(tests, backends);
