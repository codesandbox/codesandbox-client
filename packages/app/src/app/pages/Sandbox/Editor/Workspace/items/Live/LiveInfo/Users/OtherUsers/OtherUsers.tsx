import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React from 'react';

import { SubTitle } from '../../elements';

import { NoUsers, Users } from '../elements';
import { User } from '../User';

import { SideView } from './SideView';

export const OtherUsers = ({ otherUsers }) => (
  <Margin top={1}>
    <SubTitle>Users</SubTitle>

    <Users>
      {otherUsers.length ? (
        otherUsers.map(user => (
          <User
            key={user.id}
            sideView={<SideView userId={user.id} />}
            type="Spectator"
            user={user}
          />
        ))
      ) : (
        <NoUsers>No other users in session, invite them!</NoUsers>
      )}
    </Users>
  </Margin>
);
