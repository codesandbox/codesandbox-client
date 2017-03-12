// @flow
import { schema } from 'normalizr';
// import { decamelizeKeys } from 'humps';

import moduleEntity from '../modules/';
import directoryEntity from '../directories/';

export default new schema.Entity('sources', {
  modules: [moduleEntity],
  directories: [directoryEntity],
});

// const afterReceiveReducer = (source) => {
//   const newSource = {
//     ...source,
//     npmDependencies: decamelizeKeys(source.npmDependencies, { separator: '-' }),
//   };

//   return newSource;
// };

export type Source = {
  id: string;
  title: string;
  modules: Array<string>;
  directories: Array<string>;
  npmDependencies: { [key: string]: string };
  bundle: ?{
    manifest?: Object;
    hash?: string;
    url?: string;
    error?: string;
    processing?: boolean;
  },
  boilerPlates: Array<string>;
};

// export default createEntity(schema, { actions, reducer, afterReceiveReducer });
