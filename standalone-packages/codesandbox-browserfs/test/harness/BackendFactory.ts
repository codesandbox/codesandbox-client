import {FileSystem} from '../../src/core/file_system';

interface BackendFactory {
  (cb: (name: string, objs: FileSystem[]) => void): void;
}

export default BackendFactory;
