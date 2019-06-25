import { sortBy } from 'lodash-es';
import React from 'react';

import { useStore } from 'app/store';

import { Editors } from './Editors';
import { OtherUsers } from './OtherUsers';
import { Owners } from './Owners';

export const Users = () => {
  const {
    live: {
      roomInfo: { editorIds, mode, ownerIds, users },
    },
  } = useStore();

  const owners = users.filter(({ id }) => ownerIds.includes(id));
  const editors = sortBy(
    users.filter(({ id }) => editorIds.includes(id) && !ownerIds.includes(id)),
    'username'
  );
  const otherUsers = sortBy(
    users.filter(({ id }) => !ownerIds.includes(id) && !editorIds.includes(id)),
    'username'
  );

  return (
    <>
      {owners && <Owners owners={owners} />}

      {editors.length > 0 && mode === 'classroom' && (
        <Editors editors={editors} />
      )}

      <OtherUsers otherUsers={otherUsers} />
    </>
  );
};
