// Typing info only.
import * as _fs from 'fs';

import Stats from './node_fs_stats';

const EventEmitter = require('events');

interface IWatchEntry {
  filename: string;
  watcher: any;
  curr?: Stats;
  recursive?: boolean;
  persistent?: boolean;
  callback?: ((event: string, filename: string) => any) | undefined;
  fileCallback?: (curr: Stats, prev: Stats) => void;
}

export class FileWatcher {
  public triggerWatch(filename: string, event: 'change' | 'rename', newStats?: Stats) {
    const validEntries = this.watchEntries.filter(entry => {
      if (entry.filename === filename) {
        return true;
      }

      if (entry.recursive && filename.startsWith(entry.filename)) {
        return true;
      }

      return false;
    });

    validEntries.forEach(entry => {
      if (entry.callback) {
        entry.callback(event, filename);
      }

      const newStatsArg = newStats || entry.curr;
      const oldStatsArg = entry.curr || newStats;
      if (newStatsArg && oldStatsArg && entry.fileCallback) {
        entry.fileCallback(newStatsArg, oldStatsArg);
        entry.curr = newStatsArg;
      }

      entry.watcher.emit(event);

      if (!entry.persistent) {
        this.removeEntry(entry);
      }
    });
  }

  public watch(filename: string, listener?: (event: string, filename: string) => any): _fs.FSWatcher;
  public watch(filename: string, options: { recursive?: boolean; persistent?: boolean; }, listener?: (event: string, filename: string) => any): _fs.FSWatcher;
  public watch(filename: string, arg2: any, listener: (event: string, filename: string) => any = (() => {})): _fs.FSWatcher {
    const watcher = new EventEmitter();
    const watchEntry: IWatchEntry  = {
      filename,
      watcher,
    };

    watcher.close = () => {
      this.removeEntry(watchEntry);
    };


    if (typeof arg2 === 'object') {
      watchEntry.recursive = arg2.recursive;
      watchEntry.persistent = arg2.persistent === undefined ? true : arg2.persistent;
      watchEntry.callback = listener;
    } else if (typeof arg2 === 'function') {
      watchEntry.callback = arg2;
    }

    this.watchEntries.push(watchEntry);

    return watchEntry.watcher;
  }

  public watchFile(curr: Stats, filename: string, listener: (curr: Stats, prev: Stats) => void): void;
  public watchFile(curr: Stats, filename: string, options: { persistent?: boolean; interval?: number; }, listener: (curr: Stats, prev: Stats) => void): void;
  public watchFile(curr: Stats, filename: string, arg2: any, listener: (curr: Stats, prev: Stats) => void = (() => {})): void {
    const watcher = new EventEmitter();
    const watchEntry: IWatchEntry  = {
      filename,
      watcher,
      curr,
    };

    watcher.close = () => {
      this.removeEntry(watchEntry);
    };

    if (typeof arg2 === 'object') {
      watchEntry.recursive = arg2.recursive;
      watchEntry.persistent = arg2.persistent === undefined ? true : arg2.persistent;
      watchEntry.fileCallback = listener;
    } else if (typeof arg2 === 'function') {
      watchEntry.fileCallback = arg2;
    }

    this.watchEntries.push(watchEntry);

    return watchEntry.watcher;
  }

  unwatchFile(filename: string, listener: (curr: Stats, prev: Stats) => void): any {
    this.watchEntries = this.watchEntries.filter(entry => entry.filename !== filename && entry.fileCallback !== listener);
  }

  private watchEntries: IWatchEntry[] = [];

  private removeEntry(watchEntry: IWatchEntry) {
    this.watchEntries = this.watchEntries.filter(en => en !== watchEntry);
  }
}
