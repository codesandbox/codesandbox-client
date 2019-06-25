import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React from 'react';

import { SubTitle } from '../../elements';

import { Users } from '../elements';
import { User } from '../User';

import { SideView } from './SideView';

export const Editors = ({ editors }) => (
  <Margin top={1}>
    <SubTitle>Editors</SubTitle>

    <Users>
      {editors.map(user => (
        <User
          key={user.id}
          sideView={<SideView userId={user.id} />}
          type="Editor"
          user={user}
        />
      ))}
    </Users>
  </Margin>
);
