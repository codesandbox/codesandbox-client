import React from 'react';
import { inject, observer } from 'mobx-react';
import workspaceItems from 'app/store/modules/workspace/items';

import { Container, IconContainer } from './elements';

const Navigation = ({ store }) => (
  <Container>
    {workspaceItems.map(item => {
      const { Icon, id } = item;
      return (
        <IconContainer
          key={id}
          selected={id === store.workspace.openedWorkspaceItem}
        >
          <Icon />
        </IconContainer>
      );
    })}
  </Container>
);

export default inject('signals', 'store')(observer(Navigation));
