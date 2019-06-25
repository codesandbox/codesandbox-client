import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React from 'react';

import { SubTitle } from '../../elements';

import { Users } from '../elements';
import { User } from '../User';

import { SideView } from './SideView';

export const Owners = ({ owners }) => (
  <Margin top={1}>
    <SubTitle>Owners</SubTitle>

    <Users>
      {owners.map(owner => (
        <User
          key={owner.id}
          sideView={<SideView userId={owner.id} />}
          type="Owner"
          user={owner}
        />
      ))}
    </Users>
  </Margin>
);
