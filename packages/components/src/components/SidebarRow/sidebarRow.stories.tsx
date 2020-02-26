import React from 'react';

import { SidebarRow } from '.';

export default {
  title: 'components/SidebarRow',
  component: SidebarRow,
};

export const Basic = () => (
  <div style={{ border: '1px solid #000' }}>
    <SidebarRow>
      SidebarRow is a Stack with height and padding, nothing else
    </SidebarRow>
  </div>
);
